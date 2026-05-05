import { useTranslation } from 'react-i18next';
import './Services.css';

export default function Services() {
  const { t } = useTranslation();

  const SERVICES = [
    {
      icon: '🔭',
      title: t('services.list.free.title'),
      desc: t('services.list.free.desc'),
      features: [
        'Birth sign analysis',
        'Personality overview',
        'Lucky numbers & colors',
        'Gemstone suggestion'
      ],
      price: 'Free',
      cta: t('services.list.free.cta'),
      href: '#prediction',
      featured: false,
    },
    {
      icon: '🌟',
      title: t('services.list.premium.title'),
      desc: t('services.list.premium.desc'),
      features: [
        'Full birth chart',
        'Career & relationships',
        'Personalized remedies',
        'Session recording'
      ],
      price: '₹500',
      period: t('booking.period'),
      cta: t('services.list.premium.cta'),
      href: '#booking',
      featured: true,
      badge: t('services.list.premium.badge'),
    },
    {
      icon: '📜',
      title: t('services.list.report.title'),
      desc: t('services.list.report.desc'),
      features: [
        'Complete PDF report',
        'Full chart analysis',
        'Remedies & gemstones',
        '12-month forecast'
      ],
      price: '₹1500',
      period: '/ report',
      cta: t('services.list.report.cta'),
      href: '#booking',
      featured: false,
    },
  ];

  return (
    <section id="services" className="services gold-border-top">
      <div className="container">
        <span className="section-label">✦ {t('services.label')} ✦</span>
        <h2 className="section-title">{t('services.title')}</h2>
        <div className="section-divider" />

        <div className="services__grid">
          {SERVICES.map(s => (
            <div key={s.title} className={`service-card card${s.featured ? ' service-card--featured' : ''}`}>
              {s.badge && <div className="service-card__badge">{s.badge}</div>}
              <div className="service-card__icon">{s.icon}</div>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.desc}</p>
              <ul className="service-card__features">
                {s.features.map(f => <li key={f}><span>◆</span>{f}</li>)}
              </ul>
              <div className="service-card__price">
                {s.price}<span>{s.period}</span>
              </div>
              <a href={s.href} className={`btn-gold ${s.featured ? 'btn-gold-filled' : 'btn-gold-outline'} service-card__cta`}>
                {s.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
