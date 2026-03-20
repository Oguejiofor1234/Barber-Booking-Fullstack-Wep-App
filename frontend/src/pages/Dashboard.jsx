import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const STATUS_COLORS = {
  PENDING:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-green-100  text-green-800  border-green-200',
  CANCELLED: 'bg-red-100    text-red-800    border-red-200',
  COMPLETED: 'bg-blue-100   text-blue-800   border-blue-200',
};

export default function Dashboard() {
  const { user, isBarber, isAdmin, isCustomer } = useAuth();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('ALL');

  const STATUS_LABELS = {
    ALL:       t('dashboard.filter.all'),
    PENDING:   t('dashboard.status.PENDING'),
    CONFIRMED: t('dashboard.status.CONFIRMED'),
    CANCELLED: t('dashboard.status.CANCELLED'),
    COMPLETED: t('dashboard.status.COMPLETED'),
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch {
      toast.error(t('dashboard.toast.failLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    const confirmMsg = {
      CONFIRMED: t('dashboard.confirmAction.confirm'),
      CANCELLED: t('dashboard.confirmAction.cancel'),
      COMPLETED: t('dashboard.confirmAction.complete'),
    }[status];
    if (!window.confirm(confirmMsg)) return;
    const toastMsg = {
      CONFIRMED: t('dashboard.toast.confirmed'),
      CANCELLED: t('dashboard.toast.cancelled'),
      COMPLETED: t('dashboard.toast.completed'),
    }[status];
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(toastMsg || status);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed');
    }
  };

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  // Stats
  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title">
            {isBarber || isAdmin ? t('dashboard.titleBarber') : t('dashboard.titleCustomer')}
          </h1>
          <p className="text-gray-500">
            {t('dashboard.welcome')} <strong>{user?.name}</strong> ({user?.role})
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: t('dashboard.stats.total'),     value: stats.total,     color: 'text-gray-700',   bg: 'bg-white' },
            { label: t('dashboard.stats.pending'),   value: stats.pending,   color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: t('dashboard.stats.confirmed'), value: stats.confirmed, color: 'text-green-600',  bg: 'bg-green-50' },
            { label: t('dashboard.stats.cancelled'), value: stats.cancelled, color: 'text-red-600',    bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl shadow-sm border border-gray-100 p-6`}>
              <p className="text-gray-500 text-sm font-medium">{s.label}</p>
              <p className={`text-4xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {STATUS_LABELS[f]} {f !== 'ALL' && `(${bookings.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Bookings table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-400">{t('dashboard.noBookings')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {(isBarber || isAdmin) && <th className="text-left px-6 py-4 font-semibold text-gray-600">{t('dashboard.table.customer')}</th>}
                    {isCustomer && <th className="text-left px-6 py-4 font-semibold text-gray-600">{t('dashboard.table.barber')}</th>}
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">{t('dashboard.table.service')}</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">{t('dashboard.table.dateTime')}</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">{t('dashboard.table.status')}</th>
                    {(isBarber || isAdmin) && <th className="text-left px-6 py-4 font-semibold text-gray-600">{t('dashboard.table.actions')}</th>}
                    {isCustomer && <th className="text-left px-6 py-4 font-semibold text-gray-600">{t('dashboard.table.actions')}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      {(isBarber || isAdmin) && (
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{b.customer?.name}</p>
                            <p className="text-gray-400 text-xs">{b.customer?.email}</p>
                            {b.customer?.phone && <p className="text-gray-400 text-xs">{b.customer.phone}</p>}
                          </div>
                        </td>
                      )}
                      {isCustomer && (
                        <td className="px-6 py-4 text-gray-700">{b.barber?.name}</td>
                      )}
                      <td className="px-6 py-4 font-medium text-gray-800">{b.service}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(b.dateTime).toLocaleString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                          timeZone: 'America/Toronto',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${STATUS_COLORS[b.status]}`}>
                          {STATUS_LABELS[b.status] || b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {(isBarber || isAdmin) && b.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateStatus(b.id, 'CONFIRMED')}
                                className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors"
                              >
                                {t('dashboard.actions.confirm')}
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, 'CANCELLED')}
                                className="text-xs bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                              >
                                {t('dashboard.actions.reject')}
                              </button>
                            </>
                          )}
                          {(isBarber || isAdmin) && b.status === 'CONFIRMED' && (
                            <>
                              <button
                                onClick={() => updateStatus(b.id, 'COMPLETED')}
                                className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                              >
                                {t('dashboard.actions.complete')}
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, 'CANCELLED')}
                                className="text-xs bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                              >
                                {t('dashboard.actions.cancel')}
                              </button>
                            </>
                          )}
                          {isCustomer && (b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                            <button
                              onClick={() => updateStatus(b.id, 'CANCELLED')}
                              className="text-xs bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                              {t('dashboard.actions.cancel')}
                            </button>
                          )}
                          {(b.status === 'CANCELLED' || b.status === 'COMPLETED') && (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
