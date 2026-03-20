import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SERVICE_META = [
  { icon: '✂️', price: '$25', duration: '45 min' },
  { icon: '🪒', price: '$20', duration: '30 min' },
  { icon: '💈', price: '$35', duration: '45 min' },
  { icon: '💇', price: '$40', duration: '75 min' },
  { icon: '🧴', price: '$30', duration: '30 min' },
  { icon: '👦', price: '$18', duration: '30 min' },
];

export default function Services() {
  const { t } = useTranslation();
  const serviceLabels = t('services.items', { returnObjects: true });
  const SERVICES = SERVICE_META.map((meta, i) => ({ ...meta, ...serviceLabels[i] }));

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-500 font-semibold uppercase tracking-widest text-sm">{t('services.badge')}</span>
          <h2 className="section-title mt-2">{t('services.title')}</h2>
          <p className="section-subtitle">{t('services.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div key={service.name} className="card p-8 group">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-serif font-bold text-dark-800 mb-2">{service.name}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">{service.desc}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold text-primary-600">{service.price}</span>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {service.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/register" className="btn-primary inline-block text-lg">
            {t('services.bookService')}
          </Link>
        </div>
      </div>
    </section>
  );
}
