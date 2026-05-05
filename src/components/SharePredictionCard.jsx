import React from 'react';
import { useTranslation } from 'react-i18next';
import { track } from '../posthog';

export function SharePredictionCard({ name, zodiacSign, moonSign, lagna, currentDasha, tagline }) {
  const { i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareText = isHindi
    ? `मैंने अपनी वैदिक जन्मकुंडली देखी!\n☽ राशि: ${zodiacSign} | चंद्र राशि: ${moonSign} | लग्न: ${lagna}\n\n"${tagline}"\n\nअपनी निःशुल्क भविष्यवाणी पाएं:`
    : `I just got my Vedic birth chart reading!\n☽ Sign: ${zodiacSign} | Moon: ${moonSign} | Lagna: ${lagna}\n\n"${tagline}"\n\nGet yours free:`;

  const handleShare = async () => {
    track('prediction_shared', { share_method: 'native_share', zodiac_sign: zodiacSign });
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Cosmic Profile', text: shareText, url: shareUrl });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert(isHindi ? 'लिंक कॉपी हो गया!' : 'Link copied to clipboard!');
      track('prediction_shared', { share_method: 'clipboard', zodiac_sign: zodiacSign });
    }
  };

  const whatsappText = encodeURIComponent(`${shareText}\n${shareUrl}`);
  const twitterText = encodeURIComponent(`${zodiacSign} ☽ ${moonSign} Moon · ${lagna} Lagna\n\n"${tagline}"\n\nGet your free Vedic reading: ${shareUrl}`);

  return (
    <div style={{
      background: 'rgba(201,161,74,0.06)',
      border: '0.5px solid rgba(201,161,74,0.3)',
      borderRadius: '16px',
      padding: '24px',
      marginTop: '24px',
      textAlign: 'center'
    }}>
      {/* Share card preview */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0a24 0%, #1a0f3a 100%)',
        border: '1px solid rgba(201,161,74,0.3)',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '16px',
        maxWidth: '540px',
        width: '100%',
        margin: '0 auto 20px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', color: '#c9a14a', marginBottom: '12px' }}>
          ✦ VEDIC COSMIC PROFILE ✦
        </div>
        <div style={{ fontSize: '24px', fontWeight: 500, color: '#f5efe0', marginBottom: '8px' }}>
          {name}
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(245,239,224,0.6)', marginBottom: '20px', letterSpacing: '0.02em' }}>
          {zodiacSign} · {moonSign} Moon · {lagna} Lagna
        </div>
        <div style={{ 
          fontSize: '16px', 
          fontStyle: 'italic', 
          color: 'rgba(245,239,224,0.9)', 
          lineHeight: 1.6, 
          marginBottom: '24px',
          padding: '0 10px'
        }}>
          "{tagline}"
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(201,161,74,0.6)', fontWeight: 500 }}>
          shreeyaushsaxena.com
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleShare}
          style={{
            background: '#c9a14a', color: '#1a1208',
            border: 'none', borderRadius: '8px',
            padding: '10px 20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer'
          }}
        >
          {isHindi ? '✦ शेयर करें' : '✦ Share My Reading'}
        </button>
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => track('prediction_shared', { share_method: 'whatsapp', zodiac_sign: zodiacSign })}
          style={{
            background: '#25D366', color: '#fff',
            borderRadius: '8px', padding: '10px 18px',
            fontSize: '13px', fontWeight: 500, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '6px'
          }}
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${twitterText}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => track('prediction_shared', { share_method: 'twitter', zodiac_sign: zodiacSign })}
          style={{
            background: '#000', color: '#fff',
            borderRadius: '8px', padding: '10px 18px',
            fontSize: '13px', fontWeight: 500, textDecoration: 'none'
          }}
        >
          Post on X
        </a>
      </div>
    </div>
  );
}
