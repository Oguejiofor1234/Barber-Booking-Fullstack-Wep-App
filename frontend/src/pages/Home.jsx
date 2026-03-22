import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const BARBER_SECTIONS = [
  {
    id: 'jp', name: 'J.P', initial: 'J', color: 'bg-blue-600',
    services: [
      { name: 'Precision Haircut — J.P',        desc: 'Precision cut tailored to your style. Fades, tapers & textured cuts.', price: '$50', clients: ['S','M','J','B','T','A','C'] },
      { name: 'Haircut & Beard — J.P',           desc: 'Full grooming package — precision haircut plus beard shaping.',         price: '$65', clients: ['D','E','F','G','H','I','K'] },
      { name: 'Beard / Outline — J.P',           desc: 'Sharp beard line-up and edge definition for a clean, defined look.',    price: '$25', clients: ['L','N','O','P','Q','R','U'] },
      { name: 'Monday After-Work Haircut — J.P', desc: 'Quick precise after-work cut. Walk-in friendly on Mondays.',           price: '$40', clients: ['V','W','X','Y','Z','1','2'] },
      { name: 'Hot Towel Shave — J.P',           desc: 'Traditional straight-razor shave with hot towel treatment.',           price: '$35', clients: ['3','4','5','S','M','J','B'] },
      { name: 'Kids Haircut — J.P',              desc: 'Fun, patient service for boys aged 2–12.',                             price: '$18', clients: ['T','A','C','D','E','F','G'] },
    ],
  },
  {
    id: 'roland', name: 'Roland', initial: 'R', color: 'bg-emerald-600',
    services: [
      { name: 'Haircut — Roland',         desc: 'Classic and modern cuts — fades, crops, and waves by Roland.',      price: '$40', clients: ['H','I','K','L','N','O','P'] },
      { name: 'Haircut & Beard — Roland', desc: 'Complete grooming: haircut and beard trim by Roland.',               price: '$60', clients: ['Q','R','U','V','W','X','Y'] },
      { name: 'Beard / Outline — Roland', desc: 'Clean beard line-up, edge-up, and shaping by Roland.',               price: '$25', clients: ['Z','1','2','3','4','5','S'] },
    ],
  },
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

const ABOUT_TEXT = `Welcome to JP BARBER STUDIO, where it's all about quality cuts and a relaxed vibe. I offer personalised haircuts, beard trims, and grooming services, with attention to detail and customer satisfaction. As a solo barber, I make sure each appointment is all about you and your style. Book your appointment today, and let's create your perfect look together.`;

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
  const bookLink = isAuthenticated ? '/booking' : '/register';

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

  const filteredSections = BARBER_SECTIONS.map(b => ({
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
                  <h2 className="text-xl font-bold text-gray-900">Services</h2>
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input
                      type="text"
                      placeholder="Search for service"
                      value={serviceSearch}
                      onChange={e => setServiceSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-44 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Popular Services</p>

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
                              Book
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
                <h2 className="text-base font-bold text-gray-900 mb-3">Amenities</h2>
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
                <h2 className="text-base font-bold text-gray-900 mb-4">Reviews</h2>
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

              {/* ── Write a Review ─────────────────────────────────────────── */}
              <div className="py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 mb-4">Write a Review</h2>
                {reviewSent && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
                    ✓ Your review has been posted. Thank you!
                  </div>
                )}
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Your Name</label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={e => setNewReview(p => ({ ...p, name: e.target.value }))}
                      placeholder="Enter your name"
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Rating</label>
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
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Your Review</label>
                    <textarea
                      value={newReview.text}
                      onChange={e => setNewReview(p => ({ ...p, text: e.target.value }))}
                      placeholder="Share your experience at JP Barber Studio..."
                      required
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                    Post Review
                  </button>
                </form>
              </div>

              {/* Client Photos */}
              <div className="py-5 pb-24">
                <h2 className="text-base font-bold text-gray-900 mb-3">Client photos</h2>
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
                src="https://maps.google.com/maps?q=3095+Argentia+Rd+Mississauga+ON&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div className="px-4 py-4 space-y-5">

              {/* Book Now */}
              <Link
                to={bookLink}
                className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded text-center text-sm transition-colors"
              >
                Book now
              </Link>

              {/* About Us */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About Us</h3>
                <p className={`text-sm text-gray-600 leading-relaxed ${!showAbout ? 'line-clamp-4' : ''}`}>
                  {ABOUT_TEXT}
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Staffers</h3>
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
                    <p className="text-xs text-gray-700 font-medium mt-1">Roland</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Business Hours</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Today</span>
                  <span className={`text-sm font-medium ${todayHours?.open ? 'text-gray-600' : 'text-red-500'}`}>
                    {todayHours?.open ? `${todayHours.open} – ${todayHours.close}` : 'Closed'}
                  </span>
                </div>
                <button
                  onClick={() => setShowFullWeek(v => !v)}
                  className="mt-2 text-sm text-blue-500 flex items-center gap-1 hover:underline"
                >
                  Show full week {showFullWeek ? '∧' : '∨'}
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
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-80">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
