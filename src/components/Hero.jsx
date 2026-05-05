import { useTranslation } from 'react-i18next';
import { ZodiacBar } from './ZodiacBar.jsx';
import { track } from '../posthog.js';
import './Hero.css';

// The large mandala SVG — concentric rings + petal pattern
function Mandala() {
  const rings = [
    { r: 220, dash: '6 10', w: 0.8, op: 0.30 },
    { r: 190, dash: '4 8',  w: 0.6, op: 0.25 },
    { r: 160, dash: '3 6',  w: 0.5, op: 0.22 },
    { r: 130, dash: '2 4',  w: 0.5, op: 0.20 },
    { r: 100, dash: '2 3',  w: 0.4, op: 0.18 },
    { r:  70, dash: '1 3',  w: 0.4, op: 0.15 },
    { r:  40, dash: '1 2',  w: 0.4, op: 0.12 },
  ];

  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="hero__mandala-svg" aria-hidden="true">
      <defs>
        <radialGradient id="mandalaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#c9a84c" stopOpacity="0.18" />
          <stop offset="60%"  stopColor="#7c5cbf" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0a0a1a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow backdrop */}
      <circle cx="250" cy="250" r="240" fill="url(#mandalaGlow)" />

      {/* Concentric dashed rings */}
      {rings.map((ring, i) => (
        <circle key={i} cx="250" cy="250" r={ring.r}
          fill="none" stroke="#c9a84c"
          strokeWidth={ring.w} strokeDasharray={ring.dash}
          opacity={ring.op} />
      ))}

      {/* 12 radial spoke lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const a  = (i / 12) * Math.PI * 2;
        const x1 = 250 + 55  * Math.cos(a);
        const y1 = 250 + 55  * Math.sin(a);
        const x2 = 250 + 220 * Math.cos(a);
        const y2 = 250 + 220 * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#c9a84c" strokeWidth="0.5" opacity="0.18" />;
      })}

      {/* Outer petal ring — 12 petals */}
      {Array.from({ length: 12 }, (_, i) => {
        const a  = (i / 12) * Math.PI * 2;
        const cx = 250 + 175 * Math.cos(a);
        const cy = 250 + 175 * Math.sin(a);
        return <ellipse key={i} cx={cx} cy={cy} rx="14" ry="22"
          transform={`rotate(${i * 30 + 90}, ${cx}, ${cy})`}
          fill="none" stroke="#c9a84c" strokeWidth="0.7" opacity="0.22" />;
      })}

      {/* Inner star — 8-pointed */}
      {Array.from({ length: 8 }, (_, i) => {
        const a  = (i / 8) * Math.PI * 2;
        const a2 = ((i + 0.5) / 8) * Math.PI * 2;
        const ox = 250 + 55 * Math.cos(a);
        const oy = 250 + 55 * Math.sin(a);
        const ix = 250 + 28 * Math.cos(a2);
        const iy = 250 + 28 * Math.sin(a2);
        return <line key={i} x1={ox} y1={oy} x2={ix} y2={iy}
          stroke="#c9a84c" strokeWidth="0.6" opacity="0.28" />;
      })}

      {/* Center lotus */}
      {Array.from({ length: 8 }, (_, i) => {
        const a  = (i / 8) * Math.PI * 2;
        const cx = 250 + 18 * Math.cos(a);
        const cy = 250 + 18 * Math.sin(a);
        return <ellipse key={i} cx={cx} cy={cy} rx="7" ry="14"
          transform={`rotate(${i * 45 + 90}, ${cx}, ${cy})`}
          fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.30" />;
      })}

      {/* Center dot */}
      <circle cx="250" cy="250" r="4" fill="#c9a84c" opacity="0.35" />
      <circle cx="250" cy="250" r="10" fill="none" stroke="#c9a84c" strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="home" className="hero">
      {/* Large spinning mandala */}
      <div className="hero__mandala" aria-hidden="true">
        <Mandala />
      </div>

      {/* Content */}
      <div className="hero__content container">
        <span className="section-label">✦ {t('hero.badge')} ✦</span>
        <h1 className="hero__title">
          {t('hero.headline1')}<br />
          <span className="gold-text">{t('hero.headline2')}</span>
        </h1>
        <p className="hero__sub">
          {t('hero.sub')}
        </p>
        <div className="hero__ctas">
          <a href="#prediction" className="btn-gold btn-gold-filled" onClick={() => track('hero_cta_clicked', { cta: 'get_free_reading' })}>{t('hero.ctaPrimary')}</a>
          <a href="#booking"    className="btn-gold btn-gold-outline" onClick={() => track('hero_cta_clicked', { cta: 'book_session' })}>{t('hero.ctaSecondary')}</a>
        </div>
      </div>

      {/* ── Styled zodiac news-ticker strip (Pinned to bottom) ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <ZodiacBar />
      </div>
    </section>
  );
}
