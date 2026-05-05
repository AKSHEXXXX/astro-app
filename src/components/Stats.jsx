import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Stats.css';

function useCountUp(target, started) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);
  return count;
}

function StatItem({ value, suffix, label }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, started);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-value">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Stats() {
  const { t } = useTranslation();

  const STATS = [
    { value: 500, suffix: '+', label: t('stats.consultations') },
    { value: 5,   suffix: '+', label: t('stats.experience') },
    { value: 98,  suffix: '%', label: t('stats.satisfaction') },
    { value: 12,  suffix: '',  label: t('stats.specialties') },
  ];

  return (
    <div className="stats-bar">
      <div className="stats-bar__inner container">
        {STATS.map(s => <StatItem key={s.label} {...s} />)}
      </div>
    </div>
  );
}
