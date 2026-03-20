import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) { navigate('/booking'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error(t('register.toast.passwordLength'));
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success(t('register.toast.success'));
      navigate('/booking');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name',     type: 'text',     label: t('register.fields.name.label'),     placeholder: t('register.fields.name.placeholder'),     required: true  },
    { key: 'email',    type: 'email',    label: t('register.fields.email.label'),    placeholder: t('register.fields.email.placeholder'),    required: true  },
    { key: 'password', type: 'password', label: t('register.fields.password.label'), placeholder: t('register.fields.password.placeholder'), required: true  },
    { key: 'phone',    type: 'tel',      label: t('register.fields.phone.label'),    placeholder: t('register.fields.phone.placeholder'),    required: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-dark-800 mb-2">{t('register.title')}</h1>
          <p className="text-gray-500">{t('register.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ key, type, label, placeholder, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  className="input-field"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  required={required}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary w-full text-base">
              {loading ? t('register.submitting') : t('register.submit')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('register.alreadyHave')}{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">{t('register.signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
