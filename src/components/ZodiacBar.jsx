import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { track } from '../posthog';
import { generateDailyHoroscopes } from '../geminiAPI';

const SIGNS = [
  { name: 'Aries', symbol: '♈', hindi: 'मेष' },
  { name: 'Taurus', symbol: '♉', hindi: 'वृष' },
  { name: 'Gemini', symbol: '♊', hindi: 'मिथुन' },
  { name: 'Cancer', symbol: '♋', hindi: 'कर्क' },
  { name: 'Leo', symbol: '♌', hindi: 'सिंह' },
  { name: 'Virgo', symbol: '♍', hindi: 'कन्या' },
  { name: 'Libra', symbol: '♎', hindi: 'तुला' },
  { name: 'Scorpio', symbol: '♏', hindi: 'वृश्चिक' },
  { name: 'Sagittarius', symbol: '♐', hindi: 'धनु' },
  { name: 'Capricorn', symbol: '♑', hindi: 'मकर' },
  { name: 'Aquarius', symbol: '♒', hindi: 'कुंभ' },
  { name: 'Pisces', symbol: '♓', hindi: 'मीन' },
];

export function ZodiacBar() {
  const { t, i18n } = useTranslation();
  const [horoscopes, setHoroscopes] = useState({});
  const [hoveredSign, setHoveredSign] = useState(null);
  
  const locale = i18n.language;

  useEffect(() => {
    // Generate horoscopes on client side using Gemini API
    generateDailyHoroscopes(locale)
      .then(data => setHoroscopes(data.horoscopes || {}))
      .catch((e) => console.log('Error fetching horoscopes', e));
  }, [locale]);

  const handleSignHover = (signName, e) => {
    setHoveredSign(signName);
    track('zodiac_horoscope_viewed', { sign: signName, locale });
  };

  const allSigns = [...SIGNS, ...SIGNS];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(12,10,28,0.98)',
        borderBottom: '1px solid rgba(201,161,74,0.3)',
        borderTop: '0.5px solid rgba(201,161,74,0.1)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
      }}>
        <div style={{
          flexShrink: 0,
          background: '#c9a14a',
          color: '#1a1208',
          fontSize: '10.5px',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '10px 18px',
          whiteSpace: 'nowrap',
          zIndex: 2,
          boxShadow: '4px 0 15px rgba(0,0,0,0.3)'
        }}>
          {t('zodiacBar.todayLabel')}
        </div>

        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{
            display: 'flex',
            gap: '0',
            animation: 'zodiacScroll 45s linear infinite',
          }}>
            {allSigns.map((sign, i) => (
              <div
                key={`${sign.name}-${i}`}
                onMouseEnter={(e) => handleSignHover(sign.name, e)}
                onMouseLeave={() => setHoveredSign(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  borderRight: '0.5px solid rgba(201,161,74,0.2)',
                  background: hoveredSign === sign.name ? 'rgba(201,161,74,0.12)' : 'transparent',
                  transition: 'all 0.3s'
                }}
              >
                <span style={{ fontSize: '18px', color: '#c9a14a', filter: 'drop-shadow(0 0 5px rgba(201,161,74,0.3))' }}>{sign.symbol}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(245,239,224,0.9)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {locale.startsWith('hi') ? sign.hindi : sign.name}
                </span>
                {horoscopes[sign.name] && (
                  <span style={{ fontSize: '12px', color: 'rgba(245,239,224,0.5)', maxWidth: '500px', fontWeight: 400 }}>
                    — {horoscopes[sign.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {hoveredSign && horoscopes[hoveredSign] && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: 0,
          background: 'rgba(15,10,30,0.98)',
          border: '0.5px solid rgba(201,161,74,0.4)',
          borderTop: '2px solid #c9a14a',
          zIndex: 50,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px', color: '#c9a14a' }}>
            {SIGNS.find(s => s.name === hoveredSign)?.symbol}
          </span>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#c9a14a', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {locale.startsWith('hi') ? SIGNS.find(s => s.name === hoveredSign)?.hindi : hoveredSign}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(245,239,224,0.85)', lineHeight: 1.5 }}>
              {horoscopes[hoveredSign]}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes zodiacScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
