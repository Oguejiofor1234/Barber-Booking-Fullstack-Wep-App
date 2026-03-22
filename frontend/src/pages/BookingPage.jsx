import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import api from '../utils/api';

// ── Constants ─────────────────────────────────────────────────────────────────
const SERVICE_VALUES = [
  'Classic Haircut ($25)',
  'Beard Trim & Shape ($20)',
  'Hot Towel Shave ($35)',
  'Cut + Beard Combo ($40)',
  'Hair Treatment ($30)',
  'Kids Haircut ($18)',
];

const TAX_RATE = 0.13;
const DAYS     = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS   = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

const STATUS_COLORS = {
  PENDING:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-green-100  text-green-800  border-green-200',
  CANCELLED: 'bg-red-100    text-red-800    border-red-200',
  COMPLETED: 'bg-blue-100   text-blue-800   border-blue-200',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const generateSlots = (date) => {
  const slots = [];
  for (let hour = 9; hour < 19; hour++)
    for (const min of [0, 30]) {
      const d = new Date(date); d.setHours(hour, min, 0, 0); slots.push(d);
    }
  return slots;
};

const getCategory = (date) => {
  const h = date.getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
};

const fmt = (date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

const extractPrice = (svc) => { const m = svc.match(/\$(\d+)/); return m ? parseInt(m[1]) : 0; };

// ── Component ─────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const { t, i18n } = useTranslation();

  const [barbers,      setBarbers]      = useState([]);
  const [bookings,     setBookings]     = useState([]);
  const [calSlots,     setCalSlots]     = useState([]);
  const [barberId,     setBarberId]     = useState('');
  const [service,      setService]      = useState(SERVICE_VALUES[0]);
  const [weekOffset,   setWeekOffset]   = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeTab,      setTimeTab]      = useState('Morning');
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    api.get('/auth/barbers').then(r => {
      setBarbers(r.data);
      if (r.data.length > 0) setBarberId(r.data[0].id);
    }).catch(() => {});
    fetchBookings();
    fetchCalendar();
  }, []);

  const fetchBookings = async () => {
    try { const { data } = await api.get('/bookings'); setBookings(data); } catch {}
  };
  const fetchCalendar = async () => {
    try { const { data } = await api.get('/bookings/calendar'); setCalSlots(data); } catch {}
  };

  const visibleDates = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() + weekOffset * 7 + i); return d;
    });
  }, [weekOffset]);

  const rangeLabel = useMemo(() => {
    const a = visibleDates[0], b = visibleDates[6];
    return a.getMonth() === b.getMonth()
      ? `${MONTHS[a.getMonth()]} ${a.getFullYear()}`
      : `${MONTHS[a.getMonth()]} - ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  }, [visibleDates]);

  const timeSlots = useMemo(() => {
    const now = new Date();
    return generateSlots(selectedDate).map(slot => {
      if (slot <= now) return { time: slot, available: false };
      const booked = calSlots.some(b => {
        if (barberId && b.barber?.id !== barberId) return false;
        return slot >= new Date(b.dateTime) && slot < new Date(b.endTime);
      });
      return { time: slot, available: !booked };
    });
  }, [selectedDate, calSlots, barberId]);

  const filteredSlots = useMemo(() =>
    timeSlots.filter(s => getCategory(s.time) === timeTab), [timeSlots, timeTab]);

  const price   = extractPrice(service);
  const tax     = Math.round(price * TAX_RATE * 100) / 100;
  const total   = price + tax;
  const endTime = selectedTime ? new Date(selectedTime.getTime() + 60 * 60 * 1000) : null;
  const barber  = barbers.find(b => b.id === barberId);

  const handleBook = async () => {
    if (!selectedTime) return toast.error(t('booking.toast.noSlot'));
    if (!barberId)     return toast.error(t('booking.toast.noBarber'));
    setLoading(true);
    try {
      await api.post('/bookings', {
        barberId, dateTime: selectedTime.toISOString(), service,
        lang: i18n.language?.startsWith('fr') ? 'fr' : 'en',
      });
      toast.success(t('booking.toast.success'));
      setSelectedTime(null);
      fetchBookings(); fetchCalendar();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally { setLoading(false); }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm(t('booking.toast.cancelConfirm'))) return;
    try {
      await api.patch(`/bookings/${id}/status`, { status: 'CANCELLED' });
      toast.success(t('booking.toast.cancelSuccess'));
      fetchBookings(); fetchCalendar();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to cancel'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-4">

        <h1 className="text-2xl font-bold text-gray-900">{t('booking.pageTitle')}</h1>

        {/* Barber + Service */}
        <div className="bg-white rounded-2xl shadow-sm p-5 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{t('booking.form.barberLabel')}</label>
            <select className="input-field" value={barberId}
              onChange={e => { setBarberId(e.target.value); setSelectedTime(null); }}>
              <option value="">{t('booking.form.barberPlaceholder')}</option>
              {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{t('booking.form.serviceLabel')}</label>
            <select className="input-field" value={service}
              onChange={e => { setService(e.target.value); setSelectedTime(null); }}>
              {SERVICE_VALUES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Date Picker */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => { setWeekOffset(w => Math.max(0, w-1)); setSelectedTime(null); }}
              disabled={weekOffset === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 text-2xl text-gray-600">
              ‹
            </button>
            <span className="font-semibold text-gray-800">{rangeLabel}</span>
            <button onClick={() => { setWeekOffset(w => w+1); setSelectedTime(null); }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-2xl text-gray-600">
              ›
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {visibleDates.map(d => {
              const isSel   = d.toDateString() === selectedDate.toDateString();
              const isToday = d.toDateString() === new Date().toDateString();
              return (
                <button key={d.toISOString()}
                  onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                  className={`flex-shrink-0 flex flex-col items-center w-14 py-3 rounded-2xl transition-all ${
                    isSel ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}>
                  <span className="text-xs font-medium">{DAYS[d.getDay()]}</span>
                  <span className="text-xl font-bold mt-0.5">{d.getDate()}</span>
                  <span className={`mt-1.5 w-5 h-1 rounded-full ${
                    isSel ? 'bg-blue-400' : isToday ? 'bg-blue-500' : 'bg-transparent'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
            {[
              { key: 'Morning',   label: t('booking.tabs.morning') },
              { key: 'Afternoon', label: t('booking.tabs.afternoon') },
              { key: 'Evening',   label: t('booking.tabs.evening') },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => { setTimeTab(key); setSelectedTime(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeTab === key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}>{label}</button>
            ))}
          </div>
          {filteredSlots.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">{t('booking.noSlots')}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredSlots.map(({ time, available }) => {
                const isSel = selectedTime?.toISOString() === time.toISOString();
                return (
                  <button key={time.toISOString()} disabled={!available}
                    onClick={() => setSelectedTime(isSel ? null : time)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      !available ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : isSel    ? 'bg-blue-600 text-white shadow-md'
                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>{fmt(time)}</button>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking Summary */}
        {selectedTime && (
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {service.replace(/\s*\(\$\d+\)/, '')} — {barber?.name}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{fmt(selectedTime)} – {fmt(endTime)}</p>
              </div>
              <p className="font-bold text-gray-900">${price}.00</p>
            </div>
            {barber && (
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {barber.name[0]}
                </div>
                <span className="text-sm text-gray-600">{t('booking.staff')} <strong>{barber.name}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Total + Continue */}
        {selectedTime && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{t('booking.totalTax', { tax: tax.toFixed(2) })}</span>
              <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
            <button onClick={handleBook} disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 text-base">
              {loading ? t('booking.form.submitting') : t('booking.continue')}
            </button>
          </div>
        )}

        {/* My Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{t('booking.myBookings.title')}</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-400 text-sm">{t('booking.myBookings.empty')}</p>
          ) : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-sm text-gray-800">{b.service}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${STATUS_COLORS[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(b.dateTime).toLocaleString('en-US', {
                      timeZone: 'America/Toronto', weekday: 'short',
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })} · {b.barber?.name}
                  </p>
                  {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                    <button onClick={() => cancelBooking(b.id)}
                      className="mt-2 text-xs text-red-500 hover:underline">{t('booking.myBookings.cancel')}</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
