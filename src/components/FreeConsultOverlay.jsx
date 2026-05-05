import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { track } from '../posthog.js';
import { useAuth } from '../lib/AuthContext.jsx';

export default function FreeConsultOverlay() {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const { requireAuth, hasClaimedFreeConsult } = useAuth();

  useEffect(() => {
    // Show overlay after 5 seconds
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('hasSeenFreeConsult');
      if (!hasSeen) {
        setShow(true);
        track('free_consult_overlay_shown', {});
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const closeOverlay = () => {
    track('free_consult_overlay_dismissed', {});
    setShow(false);
    localStorage.setItem('hasSeenFreeConsult', 'true');
  };

  if (!show || hasClaimedFreeConsult) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(9, 7, 22, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f0a24 0%, #1a0f3a 100%)',
        border: '1px solid #c9a14a',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        <button 
          onClick={closeOverlay}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#c9a14a',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <div style={{ fontSize: '48px', marginBottom: '20px' }}>☽</div>
        <h2 style={{ color: '#c9a14a', fontSize: '28px', marginBottom: '16px' }}>
          {t('overlay.title', 'Unlock Your Free Consultation')}
        </h2>
        <p style={{ color: 'rgba(245, 239, 224, 0.8)', fontSize: '16px', lineHeight: 1.6, marginBottom: '30px' }}>
          {t('overlay.sub', 'Sign in now to claim your first 15-minute personal consultation with Shree Ayush Saxena for free.')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button style={{
            background: '#c9a14a',
            color: '#090716',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          onClick={() => {
            track('free_consult_overlay_cta_clicked', {});
            requireAuth(() => {
              closeOverlay();
              window.location.href = '#booking';
            });
          }}
          >
            {t('overlay.signIn', 'Claim Free Session')}
          </button>
          
          <button 
            onClick={closeOverlay}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(245, 239, 224, 0.4)',
              fontSize: '14px',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {t('overlay.noThanks', 'Maybe later')}
          </button>
        </div>

        <div style={{ 
          marginTop: '25px', 
          fontSize: '12px', 
          color: 'rgba(201, 161, 74, 0.6)',
          letterSpacing: '0.05em'
        }}>
          ✦ LIMITED TIME OFFER ✦
        </div>
      </div>
    </div>
  );
}
