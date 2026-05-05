import { useTranslation } from 'react-i18next';
import './Testimonials.css';

export default function Testimonials() {
  const { t } = useTranslation();

  const REVIEWS = [
    {
      text: t('testimonials.review1', "Ayush's reading was incredibly accurate. He predicted my job change to the exact month. Highly recommend!"),
      name: 'Priya S.', city: 'Mumbai', stars: 5,
    },
    {
      text: t('testimonials.review2', "I was skeptical at first, but the session gave me so much clarity about my relationship. The remedies actually worked!"),
      name: 'Rahul M.', city: 'Delhi', stars: 5,
    },
    {
      text: t('testimonials.review3', "The detailed analysis of my birth chart was eye-opening. Ayush explains everything in simple terms. Will book again."),
      name: 'Ananya K.', city: 'Bangalore', stars: 5,
    },
  ];

  return (
    <section id="testimonials" className="testimonials gold-border-top">
      <div className="container">
        <span className="section-label">✦ {t('testimonials.label')} ✦</span>
        <h2 className="section-title">{t('testimonials.title')}</h2>
        <div className="section-divider" />

        <div className="testi__grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="testi-card card">
              <div className="testi-card__quote">"</div>
              <p className="testi-card__text">{r.text}</p>
              <div className="testi-card__stars">{'★'.repeat(r.stars)}</div>
              <div className="testi-card__author">
                <strong>{r.name}</strong>
                <span>{r.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
