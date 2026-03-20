import React from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import Services from '../components/Services';

// ✏️  To change: drop your photo into public/images/ and rename it below
const ATMOSPHERE_BG = '/images/atmosphere.jpg'; // mid-page "Our Craft" background

const TESTIMONIAL_AUTHORS = [
  { name: 'Marcus D.', rating: 5, avatar: 'M' },
  { name: 'Tyler K.',  rating: 5, avatar: 'T' },
  { name: 'Andre B.', rating: 5, avatar: 'A' },
];

export default function Home() {
  const { t } = useTranslation();
  const features      = t('home.whyUs.features',       { returnObjects: true });
  const craftTags     = t('home.craft.tags',           { returnObjects: true });
  const testimonialTexts = t('home.testimonials.items', { returnObjects: true });
  const TESTIMONIALS  = TESTIMONIAL_AUTHORS.map((a, i) => ({ ...a, text: testimonialTexts[i].text }));

  return (
    <>
      <Hero />
      <Services />

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-500 font-semibold uppercase tracking-widest text-sm">{t('home.whyUs.badge')}</span>
            <h2 className="section-title mt-2">{t('home.whyUs.title')}</h2>
            <div className="w-16 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="group text-center p-10 rounded-3xl border border-gray-100 hover:border-primary-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-xl font-serif font-bold mb-3 text-dark-800">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atmosphere — full-width background photo banner */}
      <section
        className="relative min-h-[600px] py-24 overflow-hidden flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${ATMOSPHERE_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full max-w-4xl mx-auto text-center px-6">
          <span className="text-primary-400 font-semibold uppercase tracking-widest text-sm">{t('home.craft.badge')}</span>
          <h2 className="text-4xl lg:text-6xl font-serif font-black text-white mt-3 mb-6 leading-tight">
            {t('home.craft.title')} <span className="text-primary-400">{t('home.craft.highlight')}</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            {t('home.craft.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {craftTags.map(tag => (
              <span key={tag} className="px-5 py-2 border border-primary-400/50 text-primary-300 rounded-full text-sm font-medium backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-500 font-semibold uppercase tracking-widest text-sm">{t('home.testimonials.badge')}</span>
            <h2 className="section-title mt-2 text-white">{t('home.testimonials.title')}</h2>
            <div className="w-16 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-dark-700/60 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5">
                <div className="flex text-primary-400 text-xl mb-5 tracking-widest">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-gray-300 italic mb-8 leading-relaxed text-[15px]">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <p className="text-primary-400 font-semibold">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-serif font-black text-white mb-4 drop-shadow">{t('home.cta.title')}</h2>
          <p className="text-primary-100 mb-10 text-lg">{t('home.cta.description')}</p>
          <a
            href="/register"
            className="inline-block bg-white text-primary-600 font-bold py-4 px-12 rounded-xl hover:bg-gray-50 transition-all shadow-2xl text-lg hover:scale-105 active:scale-95"
          >
            {t('home.cta.button')}
          </a>
        </div>
      </section>
    </>
  );
}
