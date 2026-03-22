import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

// ✏️  To change: drop your photos into public/images/ and rename them below
const HERO_BG       = '/images/hero-bg.jpg';       // full-screen hero background
const HERO_PORTRAIT = '/images/hero-portrait.jpg'; // right-side portrait photo

export default function Hero() {
  const { isAuthenticated, isCustomer } = useAuth();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Barbershop"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-24">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-primary-600/90 border border-primary-700 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium tracking-wide">{t('hero.tagline')}</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-serif font-black text-gray-900 leading-tight mb-6 drop-shadow-sm">
            {t('hero.headline1')}<br />
            <span className="text-primary-600">{t('hero.headline2')}</span>
          </h1>

          <p className="text-gray-800 text-lg mb-8 max-w-lg leading-relaxed font-medium">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated && isCustomer ? (
              <Link to="/booking" className="btn-primary text-center text-lg py-4 px-8 shadow-xl">
                {t('hero.bookAppointment')}
              </Link>
            ) : (
              <Link to="/register" className="btn-primary text-center text-lg py-4 px-8 shadow-xl">
                {t('hero.bookAppointment')}
              </Link>
            )}
            <Link to="/gallery" className="btn-outline text-center text-lg py-4 px-8 border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white backdrop-blur-sm">
              {t('hero.viewGallery')}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6">
            {[
              { value: '500+', label: t('hero.stats.clients') },
              { value: '10+',  label: t('hero.stats.experience') },
              { value: '5★',   label: t('hero.stats.rating') },
            ].map(({ value, label }) => (
              <div key={label} className="text-center border border-gray-800/30 rounded-xl py-4 backdrop-blur-sm bg-white/60">
                <div className="text-3xl font-serif font-bold text-primary-600">{value}</div>
                <div className="text-gray-700 text-xs mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — portrait photo in styled frame */}
        <div className="hidden lg:flex justify-center">
          <div className="relative">
            {/* Decorative gold ring */}
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary-400/40 to-primary-700/20 blur-xl" />
            <img
              src={HERO_PORTRAIT}
              alt="Master Barber"
              className="relative w-80 h-[26rem] object-cover rounded-3xl shadow-2xl border-2 border-primary-500/30"
            />
            {/* Floating badge — top right */}
            <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl px-4 py-3 text-center">
              <div className="text-2xl">✂️</div>
              <div className="text-xs font-bold text-gray-700 mt-1">{t('hero.expertCut')}</div>
            </div>
            {/* Floating badge — bottom left */}
            <div className="absolute -bottom-5 -left-5 bg-primary-500 rounded-2xl shadow-xl px-4 py-3 text-white text-center">
              <div className="text-xl font-black">5★</div>
              <div className="text-xs font-medium opacity-90">{t('hero.topRated')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-800/60 animate-bounce">
        <span className="text-xs uppercase tracking-widest">{t('hero.scroll')}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
