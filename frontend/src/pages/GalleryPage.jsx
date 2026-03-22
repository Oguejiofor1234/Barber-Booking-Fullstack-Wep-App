import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// On Render, VITE_API_URL = 'https://backend.onrender.com/api'
// Uploads are served from 'https://backend.onrender.com/uploads/...'
const BACKEND_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : '';

const mediaUrl = (path) => `${BACKEND_BASE}${path}`;

const TABS = ['ALL', 'IMAGE', 'VIDEO'];

export default function GalleryPage() {
  const { isBarber, isAdmin } = useAuth();
  const [items, setItems]           = useState([]);
  const [tab, setTab]               = useState('ALL');
  const [loading, setLoading]       = useState(true);
  const [lightbox, setLightbox]     = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', file: null });

  const fetchGallery = async (type = 'ALL') => {
    setLoading(true);
    try {
      const params = type !== 'ALL' ? `?type=${type}` : '';
      const { data } = await api.get(`/gallery${params}`);
      setItems(data.items);
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(tab); }, [tab]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) return toast.error('Please select a file');

    const fd = new FormData();
    fd.append('file',        uploadForm.file);
    fd.append('title',       uploadForm.title || uploadForm.file.name);
    fd.append('description', uploadForm.description);

    setUploading(true);
    try {
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Uploaded successfully!');
      setUploadForm({ title: '', description: '', file: null });
      e.target.reset();
      fetchGallery(tab);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Deleted');
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title">Our Gallery</h1>
          <p className="section-subtitle">See our latest work — cuts, fades, shaves, and styles.</p>
        </div>

        {/* Upload (Barber/Admin only) */}
        {(isBarber || isAdmin) && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
            <h2 className="text-lg font-serif font-bold mb-4">Upload Media</h2>
            <form onSubmit={handleUpload} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Fade Cut"
                  value={uploadForm.title}
                  onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Optional description"
                  value={uploadForm.description}
                  onChange={e => setUploadForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="input-field"
                  onChange={e => setUploadForm(p => ({ ...p, file: e.target.files[0] }))}
                />
              </div>
              <button type="submit" disabled={uploading} className="btn-primary">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                tab === t
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📷</div>
            <p>No items yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className="card group relative aspect-square">
                {item.type === 'VIDEO' ? (
                  <video
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setLightbox(item)}
                    muted
                    playsInline
                  >
                    <source src={mediaUrl(item.url)} type="video/mp4" />
                    <source src={mediaUrl(item.url)} type="video/webm" />
                  </video>
                ) : (
                  <img
                    src={mediaUrl(item.url)}
                    alt={item.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setLightbox(item)}
                    loading="lazy"
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setLightbox(item)}
                    className="bg-white text-gray-800 rounded-full p-2 mr-2 hover:bg-primary-500 hover:text-white transition-colors"
                    title="View"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  {(isBarber || isAdmin) && (
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-white text-red-500 rounded-full p-2 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                {/* Video badge */}
                {item.type === 'VIDEO' && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    ▶ Video
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-primary-400"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            {lightbox.type === 'VIDEO' ? (
              <video controls autoPlay className="w-full rounded-xl max-h-[80vh]">
                <source src={mediaUrl(lightbox.url)} type="video/mp4" />
                <source src={mediaUrl(lightbox.url)} type="video/webm" />
                <source src={mediaUrl(lightbox.url)} type="video/quicktime" />
                Your browser does not support this video format.
              </video>
            ) : (
              <img src={mediaUrl(lightbox.url)} alt={lightbox.title} className="w-full rounded-xl max-h-[80vh] object-contain" />
            )}
            <div className="text-center mt-4">
              <p className="text-white font-semibold text-lg">{lightbox.title}</p>
              {lightbox.description && <p className="text-gray-400 text-sm mt-1">{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
