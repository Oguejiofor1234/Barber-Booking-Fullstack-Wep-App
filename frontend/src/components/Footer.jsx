import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif font-bold text-2xl text-white mb-4">✂️ The Barber Shop</h3>
            <p className="text-gray-400 leading-relaxed">
              Premium grooming services since 2014. We believe every man deserves to look and feel his best.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/',        label: 'Home' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/booking', label: 'Book Appointment' },
                { to: '/login',   label: 'Login' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span>📍</span> 13008 Boul.Henri-Bourassa, Quebec,QC GIG 3Y4
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> +1 (581)305-7924
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span> hello@barbershop.com
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span> Mon–Sat: 9 AM – 8 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} The Barber Shop. All rights reserved.</p>
          <div className="flex gap-4">
            {[
              { label: 'Facebook',  href: 'https://facebook.com/YourPageName',  icon: '📘' },
              { label: 'Instagram', href: 'https://instagram.com/YourHandle',    icon: '📸' },
              { label: 'Twitter',   href: 'https://twitter.com/YourHandle',      icon: '🐦' },
              { label: 'TikTok',    href: 'https://tiktok.com/@YourHandle',      icon: '🎵' },
            ].map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-400 hover:text-primary-400 text-sm transition-colors"
              >
                <span>{icon}</span> {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
