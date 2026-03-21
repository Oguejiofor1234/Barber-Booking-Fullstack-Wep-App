import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import api from '../utils/api';

// English values are stored in the DB; only display labels are translated
const SERVICE_VALUES = [
  'Classic Haircut ($25)',
  'Beard Trim & Shape ($20)',
  'Hot Towel Shave ($35)',
  'Cut + Beard Combo ($40)',
  'Hair Treatment ($30)',
  'Kids Haircut ($18)',
];
const SERVICE_PRICES = ['$25', '$20', '$35', '$40', '$30', '$18'];

const STATUS_COLORS = {
  PENDING:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-green-100  text-green-800  border-green-200',
  CANCELLED: 'bg-red-100    text-red-800    border-red-200',
  COMPLETED: 'bg-blue-100   text-blue-800   border-blue-200',
};

export default function BookingPage() {
  const { t, i18n } = useTranslation();
  const serviceLabels = t('services.items', { returnObjects: true });
  const SERVICE_OPTIONS = SERVICE_VALUES.map((value, i) => ({
    value,
    label: `${serviceLabels[i].name} (${SERVICE_PRICES[i]})`,
  }));

  const STATUS_LABELS = {
    PENDING:   t('dashboard.status.PENDING'),
    CONFIRMED: t('dashboard.status.CONFIRMED'),
    CANCELLED: t('dashboard.status.CANCELLED'),
    COMPLETED: t('dashboard.status.COMPLETED'),
  };

  const [barbers,       setBarbers]       = useState([]);
  const [bookings,      setBookings]      = useState([]);
  const [allSlots,      setAllSlots]      = useState([]);
  const [form, setForm] = useState({ barberId: '', service: SERVICE_VALUES[0], notes: '' });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/auth/barbers').then(r => setBarbers(r.data)).catch(() => {});
    fetchBookings();
    fetchAllSlots();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch {}
  };

  const fetchAllSlots = async () => {
    try {
      const { data } = await api.get('/bookings/calendar');
      setAllSlots(data);
    } catch {}
  };

  // Convert bookings to FullCalendar events
  const calendarEvents = allSlots.map(b => ({
    id: b.id,
    title: `${b.service} — ${b.status}`,
    start: b.dateTime,
    end: b.endTime,
    backgroundColor:
      b.status === 'CONFIRMED' ? '#16a34a' :
      b.status === 'CANCELLED' ? '#dc2626' :
      b.status === 'PENDING'   ? '#ca8a04' : '#2563eb',
    borderColor: 'transparent',
  }));

  const handleDateSelect = (selectInfo) => {
    const now = new Date();
    if (selectInfo.start < now) {
      toast.error(t('booking.toast.pastDate'));
      return;
    }
    setSelectedDate(selectInfo.start.toISOString());
  };

  // Single click on a time slot
  const handleDateClick = (clickInfo) => {
    const now = new Date();
    if (clickInfo.date < now) {
      toast.error(t('booking.toast.pastDate'));
      return;
    }
    setSelectedDate(clickInfo.date.toISOString());
    toast.success(t('booking.toast.slotSelected'));
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDate)  return toast.error(t('booking.toast.noDate'));
    if (!form.barberId) return toast.error(t('booking.toast.noBarber'));

    setLoading(true);
    try {
      await api.post('/bookings', {
        barberId: form.barberId,
        dateTime: selectedDate,
        service:  form.service,
        notes:    form.notes,
        lang:     i18n.language?.startsWith('fr') ? 'fr' : 'en',
      });
      toast.success(t('booking.toast.success'));
      setSelectedDate(null);
      setForm(prev => ({ ...prev, notes: '' }));
      fetchBookings();
      fetchAllSlots();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm(t('booking.toast.cancelConfirm'))) return;
    try {
      await api.patch(`/bookings/${id}/status`, { status: 'CANCELLED' });
      toast.success(t('booking.toast.cancelSuccess'));
      fetchBookings();
      fetchAllSlots();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="section-title">{t('booking.title')}</h1>
          <p className="text-gray-500">{t('booking.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left:   'prev,next today',
                center: 'title',
                right:  'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              selectable
              selectMirror
              select={handleDateSelect}
              dateClick={handleDateClick}
              events={calendarEvents}
              slotMinTime="09:00:00"
              slotMaxTime="19:00:00"
              slotDuration="01:00:00"
              snapDuration="01:00:00"
              allDaySlot={false}
              weekends={true}
              height="auto"
            />
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-serif font-bold mb-6 text-dark-800">{t('booking.form.title')}</h2>

              {selectedDate && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4 text-sm text-primary-700">
                  <strong>{t('booking.form.selected')}</strong> {new Date(selectedDate).toLocaleString(i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US', { timeZone: 'America/Toronto', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.form.barberLabel')}</label>
                  <select
                    className="input-field"
                    value={form.barberId}
                    onChange={e => setForm(prev => ({ ...prev, barberId: e.target.value }))}
                    required
                  >
                    <option value="">{t('booking.form.barberPlaceholder')}</option>
                    {barbers.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.form.serviceLabel')}</label>
                  <select
                    className="input-field"
                    value={form.service}
                    onChange={e => setForm(prev => ({ ...prev, service: e.target.value }))}
                  >
                    {SERVICE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.form.notesLabel')}</label>
                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    placeholder={t('booking.form.notesPlaceholder')}
                    value={form.notes}
                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? t('booking.form.submitting') : t('booking.form.submit')}
                </button>
              </form>
            </div>

            {/* My Bookings */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-serif font-bold mb-4 text-dark-800">{t('booking.myBookings.title')}</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-400 text-sm">{t('booking.myBookings.empty')}</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bookings.map(b => (
                    <div key={b.id} className="border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-sm text-gray-800">{b.service}</p>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[b.status]}`}>
                          {STATUS_LABELS[b.status] || b.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(b.dateTime).toLocaleString(i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US', { timeZone: 'America/Toronto', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · {b.barber?.name}
                      </p>
                      {b.status === 'PENDING' || b.status === 'CONFIRMED' ? (
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="mt-2 text-xs text-red-500 hover:underline"
                        >
                          {t('booking.myBookings.cancel')}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
