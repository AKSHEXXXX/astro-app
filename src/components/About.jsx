import { useTranslation } from 'react-i18next';
import './About.css';

export default function About() {
  const { t } = useTranslation();

  const CREDENTIALS = [
    { icon: '🎓', label: t('about.creds.jyotish') },
    { icon: '👥', label: t('about.creds.consults') },
    { icon: '📅', label: t('about.creds.since') },
  ];

  const SPECIALTIES = t('about.specs', { returnObjects: true });

  return (
    <section id="about" className="about gold-border-top">
      <div className="container">
        <span className="section-label">✦ {t('about.label')} ✦</span>
        <h2 className="section-title">{t('about.title')}</h2>
        <div className="section-divider" />

        <div className="about__grid">
          {/* Portrait */}
          <div className="about__portrait-wrap">
            <div className="about__portrait-ring">
              <div className="about__avatar" aria-label="Shree Ayush Saxena portrait">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="60" cy="60" r="60" fill="#1a1a3e" />
                  <circle cx="60" cy="45" r="22" fill="#2a2a5e" />
                  <ellipse cx="60" cy="95" rx="35" ry="28" fill="#2a2a5e" />
                  <circle cx="60" cy="45" r="20" fill="#c9a84c" opacity="0.15" />
                  <text x="60" y="52" textAnchor="middle" fill="#c9a84c" fontSize="24" fontFamily="serif">🌙</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="about__info">
            <h3 className="about__name">Shree Ayush Saxena</h3>
            <p className="about__tagline">{t('about.tagline')}</p>

            <p className="about__bio">
              {t('about.bio')}
            </p>

            <div className="about__badges">
              {CREDENTIALS.map(c => (
                <div key={c.label} className="about__badge">
                  <span>{c.icon}</span>
                  {c.label}
                </div>
              ))}
            </div>

            <div className="about__specialties">
              <h4 className="about__spec-title">{t('about.specialties')}</h4>
              <ul>
                {SPECIALTIES.map(s => (
                  <li key={s}><span className="about__dot">◆</span>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
