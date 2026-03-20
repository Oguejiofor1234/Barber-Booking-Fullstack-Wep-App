import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';

const ScissorsIcon = () => (
  <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/>
  </svg>
);

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `font-medium transition-colors duration-200 ${
      isActive ? 'text-primary-500' : 'text-gray-700 hover:text-primary-500'
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <ScissorsIcon />
            <span className="font-serif font-bold text-xl text-dark-800">The Barber Shop</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass} end>{t('nav.home')}</NavLink>
            <NavLink to="/gallery" className={navLinkClass}>{t('nav.gallery')}</NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass}>{t('nav.dashboard')}</NavLink>
            )}
            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <NavLink to="/booking" className={navLinkClass}>{t('nav.bookNow')}</NavLink>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <span className="text-sm text-gray-600">{t('nav.greeting')} <strong>{user?.name?.split(' ')[0]}</strong></span>
                <button onClick={handleLogout} className="btn-outline text-sm py-2 px-4">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">{t('nav.login')}</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">{t('nav.signUp')}</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <NavLink to="/"        className={navLinkClass} end onClick={() => setMobileOpen(false)} style={{display:'block',padding:'8px 0'}}>{t('nav.home')}</NavLink>
            <NavLink to="/gallery" className={navLinkClass}     onClick={() => setMobileOpen(false)} style={{display:'block',padding:'8px 0'}}>{t('nav.gallery')}</NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)} style={{display:'block',padding:'8px 0'}}>{t('nav.dashboard')}</NavLink>
            )}
            {isAuthenticated && user?.role === 'CUSTOMER' && (
              <NavLink to="/booking" className={navLinkClass}   onClick={() => setMobileOpen(false)} style={{display:'block',padding:'8px 0'}}>{t('nav.bookNow')}</NavLink>
            )}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-outline text-sm py-2">{t('nav.logout')}</button>
              ) : (
                <>
                  <Link to="/login"    onClick={() => setMobileOpen(false)} className="btn-outline text-sm py-2 text-center">{t('nav.login')}</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm py-2 text-center">{t('nav.signUp')}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
