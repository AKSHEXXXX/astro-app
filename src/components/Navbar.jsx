import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/AuthContext.jsx';
import { useAuthModal } from '../lib/AuthContext.jsx';
import LangToggle from './LangToggle';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { t } = useTranslation();
  const { user, signOut }     = useAuth();
  const { openModal }         = useAuthModal();
  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account';
  const avatar      = user?.user_metadata?.avatar_url;

  const NAV_LINKS = [
    { label: t('nav.home'),         href: '#home' },
    { label: t('nav.about'),        href: '#about' },
    { label: t('nav.prediction'),   href: '#prediction' },
    { label: t('nav.services'),     href: '#services' },
    { label: t('nav.testimonials'), href: '#testimonials' },
    { label: t('nav.contact'),      href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-close sidebar on any navigation (hash or URL change)
  useEffect(() => {
    const onPopState = () => setOpen(false);
    window.addEventListener('popstate', onPopState);
    // Also close on hash change (anchor clicks handled by onClick={close})
    window.addEventListener('hashchange', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
        <div className="navbar__inner container">
          <a href="#home" className="navbar__logo" aria-label="Shree Ayush Saxena Vedic Astrologer">
            <svg className="navbar__logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke="#c9a84c" strokeWidth="1" strokeDasharray="3 3"/>
              <circle cx="16" cy="16" r="11" stroke="#c9a84c" strokeWidth="1"/>
              <path d="M16 2L18.5 13.5L30 16L18.5 18.5L16 30L13.5 18.5L2 16L13.5 13.5L16 2Z" fill="url(#logoGlow)"/>
              <circle cx="16" cy="16" r="4" fill="#0a0a1a" stroke="#c9a84c" strokeWidth="1"/>
              <defs>
                <radialGradient id="logoGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 16) rotate(90) scale(14)">
                  <stop stopColor="#e8c97a" />
                  <stop offset="1" stopColor="#c9a84c" stopOpacity="0"/>
                </radialGradient>
              </defs>
            </svg>
            <span className="navbar__logo-text">
              Shree Ayush Saxena
              <small>Vedic Astrologer</small>
            </span>
          </a>

          {/* Desktop inline nav (hidden on mobile) */}
          <nav className="navbar__desktop-nav" aria-label="Desktop Navigation">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="navbar__link">{l.label}</a>
            ))}
            <LangToggle />
            {user ? (
              <div className="navbar__user">
                {avatar
                  ? <img src={avatar} alt={displayName} className="navbar__user-avatar" />
                  : <div className="navbar__user-avatar navbar__user-avatar--fallback">{displayName[0].toUpperCase()}</div>
                }
                <span className="navbar__user-name">{displayName}</span>
                <div className="navbar__user-dropdown">
                  <a href="#dashboard" className="navbar__dropdown-item">📅 My Dashboard</a>
                  <button className="navbar__dropdown-item navbar__dropdown-item--btn" onClick={signOut}>Sign Out</button>
                </div>
              </div>
            ) : (
              <button className="navbar__signin-btn" onClick={openModal}>Sign In</button>
            )}
          </nav>

          <button
            className="navbar__hamburger"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(o => !o)}
          >
            <span /><span /><span />
          </button>

          {/* Sidebar Drawer */}
          <nav className={`navbar__sidebar${open ? ' navbar__sidebar--open' : ''}`} id="main-nav" role="navigation" aria-label="Mobile Navigation">
            <div className="navbar__sidebar-title">☽ Menu</div>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="navbar__link" onClick={close}>{l.label}</a>
            ))}
            <a href="/?admin=true" className="navbar__link" onClick={close} style={{ color: '#c9a14a' }}>Admin Portal</a>
            <div style={{ height: '1px', background: 'rgba(201,161,74,0.15)', width: '100%' }} />
            {user ? (
              <>
                <a href="#dashboard" className="navbar__link" onClick={close} style={{ color: '#e8c97a' }}>📅 My Dashboard</a>
                <button className="navbar__link" style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(245,239,224,0.5)', textAlign:'left', padding:0 }} onClick={() => { signOut(); close(); }}>Sign Out</button>
              </>
            ) : (
              <button className="navbar__signin-btn" style={{ width: '100%' }} onClick={() => { openModal(); close(); }}>Sign In</button>
            )}
            <LangToggle />
          </nav>
        </div>

        {/* Full-screen overlay on mobile */}
        {open && (
          <div className="navbar__overlay" onClick={close} aria-hidden="true" />
        )}
      </header>

      {/* Skip link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
    </>
  );
}
