import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const MAIN_PHOTO  = '/images/JP_barber.jpg';
const LOGO_IMG    = '/images/Logo.jpg';
const JP_PHOTO    = '/images/JP_barber.jpg';
const THUMBNAILS  = [
  '/images/JP_barber.jpg',
  '/images/Head_1.jpg',
  '/images/Head_2.jpg',
  '/images/Head_3.jpg',
  '/images/Head_5.jpg',
];
const CLIENT_PHOTOS = [
  '/images/Head_1.jpg',
  '/images/Head_2.jpg',
  '/images/Head_3.jpg',
  '/images/Head_5.jpg',
];

const HOURS = [
  { day: 'Monday',    open: '8:00 AM', close: '8:00 PM'  },
  { day: 'Tuesday',   open: '8:00 AM', close: '8:00 PM'  },
  { day: 'Wednesday', open: '8:00 AM', close: '8:00 PM'  },
  { day: 'Thursday',  open: '8:00 AM', close: '8:00 PM'  },
  { day: 'Friday',    open: '8:00 AM', close: '8:00 PM'  },
  { day: 'Saturday',  open: '8:00 AM',  close: '8:00 PM'  },
  { day: 'Sunday',    open: null,       close: null        },
];

// Same service values as BookingPage — single source of truth
const SERVICE_DEFS = [
  { label: 'Classic Haircut',    labelFr: 'Coupe Classique',           price: '$25',
    desc:   'Precision cut tailored to your style. Fades, tapers, textured cuts & more.',
    descFr: 'Coupe de précision adaptée à votre style. Dégradés, tapers, coupes texturées.' },
  { label: 'Beard Trim & Shape', labelFr: 'Taille & Mise en Forme',    price: '$20',
    desc:   'Expert shaping and grooming for a clean, defined beard.',
    descFr: 'Mise en forme experte pour une barbe propre et bien définie.' },
  { label: 'Hot Towel Shave',    labelFr: 'Rasage à la Serviette Chaude', price: '$35',
    desc:   'Traditional straight-razor shave with hot towel treatment.',
    descFr: 'Rasage traditionnel au rasoir droit avec traitement à la serviette chaude.' },
  { label: 'Cut + Beard Combo',  labelFr: 'Combo Coupe + Barbe',       price: '$40',
    desc:   'Complete grooming package — haircut plus beard shaping.',
    descFr: 'Forfait complet — coupe de cheveux et mise en forme de la barbe.' },
  { label: 'Hair Treatment',     labelFr: 'Traitement Capillaire',     price: '$30',
    desc:   'Deep conditioning, scalp massage, and moisturizing treatment.',
    descFr: 'Soin profond, massage du cuir chevelu et traitement hydratant.' },
  { label: 'Kids Haircut',       labelFr: 'Coupe Enfant',              price: '$18',
    desc:   'Fun, patient service for boys aged 2–12.',
    descFr: 'Service amusant et patient pour les garçons de 2 à 12 ans.' },
];

const CLIENTS_POOL = [
  ['S','M','J','B','T','A','C'],
  ['D','E','F','G','H','I','K'],
  ['L','N','O','P','Q','R','U'],
  ['V','W','X','Y','Z','1','2'],
  ['3','4','5','S','M','J','B'],
  ['T','A','C','D','E','F','G'],
];

const makeServices = (barberName, fr = false) =>
  SERVICE_DEFS.map((s, i) => ({
    name:   `${fr ? s.labelFr : s.label} — ${barberName}`,
    desc:   fr ? s.descFr : s.desc,
    price:  s.price,
    clients: CLIENTS_POOL[i],
  }));

const BARBER_SECTIONS = [
  { id: 'jp',    name: 'J.P',   initial: 'J', color: 'bg-blue-600',    services: makeServices('J.P')   },
  { id: 'admin', name: 'Admin', initial: 'A', color: 'bg-emerald-600', services: makeServices('Admin') },
];

const INITIAL_REVIEWS = [
  { name: 'Sita Elena', avatar: 'S', color: 'bg-pink-500',   date: 'Nov 10, 2024', rating: 5, service: 'Precision Haircut — J.P',  staff: 'J.P',    text: "JP did a great job with my husband's haircut. He was easy to talk to, paid attention to what was requested, and made sure everything looked clean." },
  { name: 'Mike',       avatar: 'M', color: 'bg-blue-500',   date: 'Nov 11, 2024', rating: 5, service: 'Precision Haircut — J.P',  staff: 'J.P',    text: "Top service always consistent and very accommodating. Wouldn't go to any other barber." },
  { name: 'Julian',     avatar: 'J', color: 'bg-purple-500', date: 'Feb 22, 2026', rating: 5, service: 'Haircut & Beard — J.P',    staff: 'J.P',    text: 'Very good cuts. Been seeing JP for a few years, he is an amazing barber with top quality service.' },
  { name: 'TumTum',     avatar: 'T', color: 'bg-yellow-500', date: 'Feb 20, 2026', rating: 5, service: 'Precision Haircut — J.P',  staff: 'J.P',    text: 'Best barber in the GTA by a long shot.' },
  { name: 'Brandon',    avatar: 'B', color: 'bg-red-500',    date: 'Feb 20, 2026', rating: 5, service: 'Precision Haircut — J.P',  staff: 'J.P',    text: 'The best!' },
  { name: 'Tomasz',     avatar: 'T', color: 'bg-orange-500', date: 'Feb 08, 2026', rating: 5, service: 'Haircut & Beard — J.P',    staff: 'J.P',    text: 'Amazing!' },
  { name: 'Raul',       avatar: 'R', color: 'bg-teal-500',   date: 'Oct 10, 2024', rating: 4, service: 'Precision Haircut — J.P',  staff: 'J.P',    text: 'Best barber hands down.' },
  { name: 'Brian',      avatar: 'B', color: 'bg-indigo-500', date: 'Feb 19, 2026', rating: 5, service: 'Precision Haircut — J.P',  staff: 'J.P',    text: 'Overall great experience, good attention to detail and definitely would recommend him.' },
  { name: 'Joshua',     avatar: 'J', color: 'bg-lime-600',   date: 'Jan 30, 2026', rating: 5, service: 'Precision Haircut — J.P',  staff: 'J.P',    text: 'Best barber and will keep saying best BARBER IN THE GTA 💈🏾💈🏾' },
];

const AMENITIES = [
  { icon: '🅿️', label: 'Parking space' },
  { icon: '📶', label: 'WiFi' },
  { icon: '💳', label: 'Credit cards accepted' },
];

const CLIENT_COLORS = [
  'bg-blue-400','bg-green-500','bg-purple-500','bg-orange-400',
  'bg-pink-500','bg-teal-500','bg-red-400','bg-yellow-500','bg-indigo-400',
];

const Stars = ({ n = 5, interactive = false, onSelect }) => (
  <span className="tracking-tight">
    {[1,2,3,4,5].map(i => (
      <span
        key={i}
        onClick={() => interactive && onSelect && onSelect(i)}
        className={`${i <= n ? 'text-orange-400' : 'text-gray-300'} text-sm ${interactive ? 'cursor-pointer hover:text-orange-300' : ''}`}
      >★</span>
    ))}
  </span>
);

const ABOUT_TEXT_EN = `Welcome to JP BARBER STUDIO, where it's all about quality cuts and a relaxed vibe. I offer personalised haircuts, beard trims, and grooming services, with attention to detail and customer satisfaction. As a solo barber, I make sure each appointment is all about you and your style. Book your appointment today, and let's create your perfect look together.`;
const ABOUT_TEXT_FR = `Bienvenue chez JP BARBER STUDIO, où tout est question de coupes de qualité dans une ambiance détendue. J'offre des coupes personnalisées, tailles de barbe et services de soins, avec une attention particulière aux détails et à la satisfaction du client. Prenez rendez-vous aujourd'hui et créons ensemble votre look parfait.`;

const ALL_PHOTOS = [
  '/images/JP_barber.jpg',
  '/images/Head_1.jpg',
  '/images/Head_2.jpg',
  '/images/Head_3.jpg',
  '/images/Head_5.jpg',
  '/images/atmosphere.jpg',
  '/images/hero-portrait.jpg',
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { i18n } = useTranslation();
  const fr = i18n.language?.startsWith('fr');
  const bookLink = isAuthenticated ? '/booking' : '/register';

  // Simple FR/EN helper
  const tx = (en, frText) => fr ? frText : en;

  const [reviews,        setReviews]        = useState(INITIAL_REVIEWS);
  const [showFullWeek,   setShowFullWeek]   = useState(false);
  const [showAbout,      setShowAbout]      = useState(false);
  const [serviceSearch,  setServiceSearch]  = useState('');
  const [newReview,      setNewReview]      = useState({ name: '', rating: 5, text: '' });
  const [reviewSent,     setReviewSent]     = useState(false);
  const [lightbox,       setLightbox]       = useState(null);  // { photos, index }
  const [showAllModal,   setShowAllModal]   = useState(false);

  const openLightbox = (photos, index) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const prevPhoto = () => setLightbox(l => ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }));
  const nextPhoto = () => setLightbox(l => ({ ...l, index: (l.index + 1) % l.photos.length }));

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = HOURS.find(h => h.day === today);
  const totalReviews = reviews.length;

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1);

  // Rebuild sections with correct language
  const localizedSections = BARBER_SECTIONS.map(b => ({
    ...b,
    services: makeServices(b.name, fr),
  }));

  const filteredSections = localizedSections.map(b => ({
    ...b,
    services: b.services.filter(s =>
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.desc.toLowerCase().includes(serviceSearch.toLowerCase())
    ),
  })).filter(b => b.services.length > 0);

  const submitReview = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) return;
    const colors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-red-500','bg-orange-500'];
    setReviews(prev => [{
      name: newReview.name.trim(),
      avatar: newReview.name.trim()[0].toUpperCase(),
      color: colors[Math.floor(Math.random() * colors.length)],
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rating: newReview.rating,
      service: 'Walk-in',
      staff: 'J.P',
      text: newReview.text.trim(),
    }, ...prev]);
    setNewReview({ name: '', rating: 5, text: '' });
    setReviewSent(true);
    setTimeout(() => setReviewSent(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Lightbox Modal ─────────────────────────────────────────────────── */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10">&times;</button>
          <button onClick={e => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10 px-2">&lsaquo;</button>
          <img
            src={lightbox.photos[lightbox.index]}
            alt="Full view"
            className="max-h-screen max-w-full object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button onClick={e => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10 px-2">&rsaquo;</button>
          <p className="absolute bottom-4 text-white text-sm opacity-60">
            {lightbox.index + 1} / {lightbox.photos.length}
          </p>
        </div>
      )}

      {/* ── Show All Photos Modal ───────────────────────────────────────────── */}
      {showAllModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">All Photos</h2>
              <button onClick={() => setShowAllModal(false)} className="text-white text-3xl hover:text-gray-300">&times;</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ALL_PHOTOS.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => { setShowAllModal(false); openLightbox(ALL_PHOTOS, i); }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-0">

          {/* ════════════════ LEFT COLUMN ════════════════ */}
          <div className="flex-1 min-w-0 bg-white">

            {/* Large hero photo */}
            <div className="relative">
              <img src={MAIN_PHOTO} alt="JP Barber Studio" className="w-full h-72 md:h-96 object-cover" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="bg-white rounded-lg p-2 shadow text-gray-600 hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                </button>
                <button className="bg-white rounded-lg p-2 shadow text-gray-600 hover:bg-gray-50">♡</button>
              </div>
              <button
                onClick={() => setShowAllModal(true)}
                className="absolute bottom-3 right-3 bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded shadow border border-gray-200 hover:bg-white cursor-pointer"
              >
                Show all photos
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-px bg-gray-200">
              {THUMBNAILS.map((src, i) => (
                <img key={i} src={src} alt="" className="flex-1 h-20 object-cover cursor-pointer hover:opacity-90" />
              ))}
            </div>

            <div className="px-4 md:px-6">

            {/* Business name row */}
              <div className="flex items-start justify-between py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img src={LOGO_IMG} alt="JP Barber Studio Logo" className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-200" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">JP BARBER STUDIO</h1>
                    <p className="text-xs text-gray-500 mt-0.5">13008 Boul.Henri-Bourassa, Quebec, QC GIG 3Y4</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-1">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  </button>
                  <button className="text-gray-400 hover:text-red-400">♡</button>
                </div>
              </div>

              {/* Rating + category */}
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Stars n={5} />
                  <span className="text-sm font-semibold text-gray-800">{avgRating}</span>
                  <span className="text-sm text-blue-500 hover:underline cursor-pointer">({totalReviews} reviews)</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">Entrepreneur</p>
              </div>

              {/* Services */}
              <div className="py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{tx('Services', 'Services')}</h2>
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input
                      type="text"
                      placeholder={tx('Search for service', 'Rechercher un service')}
                      value={serviceSearch}
                      onChange={e => setServiceSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-44 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{tx('Popular Services', 'Services Populaires')}</p>

                {filteredSections.map((barber, bi) => (
                  <div key={barber.id} className={bi > 0 ? 'mt-6 pt-6 border-t border-gray-100' : ''}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${barber.color} flex items-center justify-center text-white font-bold text-xs`}>
                          {barber.initial}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{barber.name}</span>
                        <span className="text-blue-500 text-xs">✓</span>
                      </div>
                      <span className="text-xs text-gray-400">{barber.services.length} services</span>
                    </div>
                    {barber.services.map((svc, si) => (
                      <div key={si} className="py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{svc.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{svc.desc}</p>
                            <div className="flex mt-2">
                              {svc.clients.slice(0, 7).map((c, ci) => (
                                <div key={ci} className={`w-6 h-6 rounded-full ${CLIENT_COLORS[ci % CLIENT_COLORS.length]} flex items-center justify-center text-white font-bold text-[9px] border-2 border-white -ml-1 first:ml-0`}>
                                  {c}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-800">{svc.price}</span>
                            <Link to={bookLink} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors">
                              {tx('Book', 'Réserver')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div className="py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 mb-3">{tx('Amenities', 'Commodités')}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES.map(a => (
                    <div key={a.label} className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{a.icon}</span><span>{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 mb-4">{tx('Reviews', 'Avis')}</h2>
                <div className="flex items-center gap-6 mb-5">
                  <div className="text-center">
                    <p className="text-5xl font-black text-gray-900">{avgRating}</p>
                    <Stars n={Math.round(parseFloat(avgRating))} />
                    <p className="text-xs text-gray-400 mt-1">{totalReviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5,4,3,2,1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const pct   = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-2">{star}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Client photos row */}
                <div className="flex gap-2 mb-5">
                  {CLIENT_PHOTOS.slice(0, 2).map((p, i) => (
                    <img key={i} src={p} alt="Client" className="w-20 h-20 object-cover rounded-lg" />
                  ))}
                </div>

                {/* Review cards */}
                <div className="space-y-5">
                  {reviews.map((r, i) => (
                    <div key={i} className="pb-5 border-b border-gray-50 last:border-0">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {r.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                            <span className="text-xs text-gray-400 flex-shrink-0">{r.date}</span>
                          </div>
                          <Stars n={r.rating} />
                          <p className="text-xs text-gray-400 mt-0.5">Service: {r.service} · Staff: {r.staff}</p>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{r.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Write a Review ────────────────────────────────────────────────── */}
              <div className="py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 mb-4">{tx('Write a Review', 'Écrire un Avis')}</h2>
                {reviewSent && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
                    ✓ Your review has been posted. Thank you!
                  </div>
                )}
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{tx('Your Name', 'Votre Nom')}</label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={e => setNewReview(p => ({ ...p, name: e.target.value }))}
                      placeholder={tx('Enter your name', 'Entrez votre nom')}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{tx('Rating', 'Note')}</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(p => ({ ...p, rating: star }))}
                          className={`text-2xl transition-colors ${star <= newReview.rating ? 'text-orange-400' : 'text-gray-300 hover:text-orange-300'}`}
                        >★</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{tx('Your Review', 'Votre Avis')}</label>
                    <textarea
                      value={newReview.text}
                      onChange={e => setNewReview(p => ({ ...p, text: e.target.value }))}
                      placeholder={tx('Share your experience at JP Barber Studio...', 'Partagez votre expérience chez JP Barber Studio...')}
                      required
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                    {tx('Post Review', 'Publier l\'Avis')}
                  </button>
                </form>
              </div>

              {/* Client Photos */}
              <div className="py-5 pb-24">
                <h2 className="text-base font-bold text-gray-900 mb-3">{tx('Client photos', 'Photos des Clients')}</h2>
                <div className="flex gap-2 mb-3">
                  <button className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-600 hover:bg-gray-50"># All</button>
                  <button className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-600 hover:bg-gray-50">Sort By: Newest</button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {CLIENT_PHOTOS.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      alt={`Hairstyle ${i+1}`}
                      className="w-full h-28 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openLightbox(CLIENT_PHOTOS, i)}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ════════════════ RIGHT SIDEBAR ════════════════ */}
          <div className="lg:w-80 flex-shrink-0 border-l border-gray-100">

            {/* Map */}
            <div className="h-40 bg-gray-200 overflow-hidden">
              <iframe
                title="JP Barber Studio location"
                src="https://maps.google.com/maps?q=13008+Boul+Henri-Bourassa+Quebec+QC+G1G+3Y4&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Address card with directions arrow */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=13008+Boul+Henri-Bourassa+Quebec+QC+G1G+3Y4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              <img src={LOGO_IMG} alt="Logo" className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-200" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-tight">JP BARBER STUDIO</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">13008 Boul. Henri-Bourassa, Quebec, QC G1G 3Y4</p>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:border-blue-400 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </a>

            <div className="px-4 py-4 space-y-5">

              {/* Book Now */}
              <Link
                to={bookLink}
                className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded text-center text-sm transition-colors"
              >
                {tx('Book now', 'Prendre rendez-vous')}
              </Link>

              {/* About Us */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{tx('About Us', 'À propos')}</h3>
                <p className={`text-sm text-gray-600 leading-relaxed ${!showAbout ? 'line-clamp-4' : ''}`}>
                  {fr ? ABOUT_TEXT_FR : ABOUT_TEXT_EN}
                </p>
                <button
                  onClick={() => setShowAbout(v => !v)}
                  className="text-sm text-blue-500 mt-1 flex items-center gap-1"
                >
                  {showAbout ? 'Show less ∧' : 'SHOW MORE ∨'}
                </button>
              </div>

              {/* Staffers */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{tx('Staffers', 'Personnel')}</h3>
                <div className="flex gap-5">
                  <div className="text-center">
                    <img src={LOGO_IMG} alt="JP" className="w-14 h-14 rounded-full object-cover mx-auto ring-2 ring-gray-200" />
                    <p className="text-xs text-gray-700 font-medium mt-1">JP</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto ring-2 ring-gray-100">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-700 font-medium mt-1">Admin</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{tx('Business Hours', 'Heures d\'ouverture')}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{tx('Today', "Aujourd'hui")}</span>
                  <span className={`text-sm font-medium ${todayHours?.open ? 'text-gray-600' : 'text-red-500'}`}>
                    {todayHours?.open ? `${todayHours.open} – ${todayHours.close}` : 'Closed'}
                  </span>
                </div>
                <button
                  onClick={() => setShowFullWeek(v => !v)}
                  className="mt-2 text-sm text-blue-500 flex items-center gap-1 hover:underline"
                >
                  {tx('Show full week', 'Voir la semaine complète')} {showFullWeek ? '∧' : '∨'}
                </button>
                {showFullWeek && (
                  <div className="mt-3 space-y-2">
                    {HOURS.map(h => (
                      <div key={h.day} className={`flex justify-between text-xs ${h.day === today ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        <span>{h.day}</span>
                        <span className={h.open ? '' : 'text-red-400'}>{h.open ? `${h.open} – ${h.close}` : 'Closed'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Details */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Details</h3>
                <p className="text-sm font-semibold text-gray-800">JP BARBER STUDIO</p>
                <div className="flex items-start gap-1.5 mt-1">
                  <svg className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                  <p className="text-xs text-gray-400 leading-relaxed">Log in or create an account to contact this business</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="border-t border-gray-100 pt-4 pb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Social Media</h3>
                <div className="flex gap-3 flex-wrap">

                  {/* Instagram */}
                  <a href="https://instagram.com/jpbarberstudio" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:opacity-80 transition-opacity" title="Instagram">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a href="https://www.facebook.com/people/JPBarber/61563041250685/" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:opacity-80 transition-opacity" title="Facebook">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* Twitter / X */}
                  <a href="https://twitter.com/jpbarberstudio" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition-opacity" title="X (Twitter)">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a href="https://tiktok.com/@jpbarberstudio" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition-opacity" title="TikTok">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                    </svg>
                  </a>

                  {/* WhatsApp */}
                  <a href="https://wa.me/15141234567" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center hover:opacity-80 transition-opacity" title="WhatsApp">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
