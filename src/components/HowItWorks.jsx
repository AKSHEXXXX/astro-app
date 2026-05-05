import { useTranslation } from 'react-i18next';
import './HowItWorks.css';

export default function HowItWorks() {
  const { t } = useTranslation();

  const STEPS = [
    { num: '01', icon: '📝', title: t('hiw.steps.0.title'), desc: t('hiw.steps.0.desc') },
    { num: '02', icon: '🔮', title: t('hiw.steps.1.title'), desc: t('hiw.steps.1.desc') },
    { num: '03', icon: '🌟', title: t('hiw.steps.2.title'), desc: t('hiw.steps.2.desc') },
  ];

  return (
    <section className="hiw gold-border-top">
      <div className="container">
        <span className="section-label">✦ {t('hiw.label')} ✦</span>
        <h2 className="section-title">{t('hiw.title')}</h2>
        <div className="section-divider" />

        <div className="hiw__steps">
          {STEPS.map((step, i) => (
            <div key={step.num} className="hiw__step">
              <div className="hiw__circle">
                <span className="hiw__icon">{step.icon}</span>
                <span className="hiw__num">{step.num}</span>
              </div>
              <h3 className="hiw__title">{step.title}</h3>
              <p className="hiw__desc">{step.desc}</p>
              {i < STEPS.length - 1 && <div className="hiw__connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
