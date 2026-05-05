import { useState, useRef } from 'react';
import { getZodiacSign, getMoonSign, calculateAge, ZODIAC_SIGNS, INSIGHTS } from '../data/zodiac.js';
import { generateBirthChart } from '../data/birthChart.js';
import BirthChart from './BirthChart.jsx';
import { LLMPredictionDisplay } from './LLMPredictionDisplay.jsx';
import { SharePredictionCard } from './SharePredictionCard.jsx';
import { FreeConsultCTA } from './FreeConsultCTA.jsx';
import { generatePrediction } from '../geminiAPI.js';
import { track } from '../posthog.js';
import { useTranslation } from 'react-i18next';
import { savePrediction } from '../lib/supabase.js';
import { useAuth } from '../lib/AuthContext.jsx';
import './Prediction.css';

const RASI_SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

function RasiChart({ sunSign }) {
  return (
    <div className="rasi-chart">
      <h4 className="rasi-title">Rasi Chart (South Indian Style)</h4>
      <div className="rasi-grid">
        {RASI_SIGNS.map((sign, i) => (
          <div key={sign} className={`rasi-cell${sign === sunSign ? ' rasi-cell--active' : ''}`}>
            <span className="rasi-num">{i + 1}</span>
            <span className="rasi-sign">{sign.slice(0, 3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Prediction() {
  const [form, setForm]     = useState({ name:'', dob:'', tob:'', place:'', gender:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [llmPrediction, setLlmPrediction] = useState(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, requireAuth } = useAuth();
  const pendingFormRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name   = 'Please enter your full name';
    if (!form.dob)          e.dob    = 'Please select your date of birth';
    if (!form.place.trim()) e.place  = 'Please enter your birth place';
    if (!form.gender)       e.gender = 'Please select your gender';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    // Require auth before running prediction
    requireAuth(() => runPrediction());
  };

  const runPrediction = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const d     = new Date(form.dob);
      const month = d.getMonth() + 1;
      const day   = d.getDate();
      const sign  = getZodiacSign(month, day);
      const data  = ZODIAC_SIGNS[sign];
      const moon  = getMoonSign(form.dob);
      const age   = calculateAge(form.dob);
      const insight = INSIGHTS[sign];

      let birthChartData = null;
      try {
        birthChartData = generateBirthChart(
          form.name, form.dob, form.tob || '', form.place, form.gender
        );
      } catch (err) {
        console.warn('Birth chart calculation error:', err);
      }

      const res = { name: form.name, sign, moon, age, data, insight, birthChartData };
      setResult(res);
      setLoading(false);

      track('prediction_form_submitted', {
        has_birth_time: !!form.tob,
        gender: form.gender,
        locale: i18n.language
      });

      if (birthChartData) {
        setLlmLoading(true);
        generatePrediction({
          name: form.name,
          dob: form.dob,
          gender: form.gender,
          lagna: birthChartData.ascendant,
          sunSign: sign,
          moonSign: moon,
          nakshatra: birthChartData.nakshatra,
          currentDasha: birthChartData.dasha?.current?.planet,
          planets: Object.values(birthChartData.planets || {})
        }, i18n.language).then(prediction => {
          setLlmPrediction(prediction);
          track('prediction_result_viewed', { zodiac_sign: sign, locale: i18n.language });
          savePrediction({
            name:      form.name,
            dob:       form.dob,
            tob:       form.tob,
            place:     form.place,
            gender:    form.gender,
            zodiacSign: sign,
            moonSign:  moon,
            nakshatra: birthChartData?.nakshatra?.name,
            lagna:     birthChartData?.ascendant?.rashiName,
            dasha:     birthChartData?.dasha?.current?.planet,
            tagline:   prediction?.summaryTagline,
            locale:    i18n.language,
            userId:    user?.id,
          });
        }).catch(err => {
          console.error(err);
          track('prediction_llm_error', { zodiac_sign: sign, locale: i18n.language, error: err?.message });
        }).finally(() => {
          setLlmLoading(false);
        });
      }
    }, 2500);
  };


  const reset = () => {
    setResult(null);
    setLlmPrediction(null);
    setLlmLoading(false);
    setForm({ name:'', dob:'', tob:'', place:'', gender:'' });
    setErrors({});
  };

  return (
    <section id="prediction" className="prediction gold-border-top">
      <div className="container">
        <span className="section-label">✦ Free Cosmic Reading ✦</span>
        <h2 className="section-title">{t('prediction.title')}</h2>
        <p className="prediction__sub">{t('prediction.sub')}</p>
        <div className="section-divider" />

        {/* ── Prediction Form ── */}
        {!result && !loading && (
          <form className="pred-form card" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="pred-name">{t('prediction.nameLabel')} *</label>
              <input id="pred-name" type="text" placeholder={t('prediction.namePlaceholder')}
                value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="pred-form__row">
              <div className="form-group">
                <label htmlFor="pred-dob">{t('prediction.dobLabel')} *</label>
                <input id="pred-dob" type="date"
                  value={form.dob} onChange={e => setForm(f=>({...f, dob:e.target.value}))} />
                {errors.dob && <span className="field-error">{errors.dob}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="pred-tob">{t('prediction.tobLabel')}</label>
                <input id="pred-tob" type="time"
                  value={form.tob} onChange={e => setForm(f=>({...f, tob:e.target.value}))} />
              </div>
            </div>

            <div className="pred-form__row">
              <div className="form-group">
                <label htmlFor="pred-place">{t('prediction.pobLabel')} *</label>
                <input id="pred-place" type="text" placeholder="City, State"
                  value={form.place} onChange={e => setForm(f=>({...f, place:e.target.value}))} />
                {errors.place && <span className="field-error">{errors.place}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="pred-gender">{t('prediction.genderLabel')} *</label>
                <select id="pred-gender" value={form.gender}
                  onChange={e => setForm(f=>({...f, gender:e.target.value}))}>
                  <option value="">Select...</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                {errors.gender && <span className="field-error">{errors.gender}</span>}
              </div>
            </div>

            <button type="submit" className="btn-gold btn-gold-filled pred-form__submit">
              ✨ {t('prediction.generateBtn')}
            </button>
          </form>
        )}

        {/* ── Loading spinner ── */}
        {loading && (
          <div className="pred-loading">
            <div className="pred-loading__wheel">
              {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((s,i) => (
                <span key={i} style={{ '--i': i }}>{s}</span>
              ))}
            </div>
            <p>{t('prediction.generating')}</p>
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <div className="pred-result card fade-in">
            <h3 className="pred-result__title">✦ {t('result.cosmicProfile')}</h3>

            {/* Summary rows */}
            <div className="pred-result__grid">
              {[
                ['Name',            result.name],
                ['Zodiac Sign',     `${result.sign} ${result.data?.symbol || ''}`],
                ['Moon Sign',       result.moon],
                ['Rising Sign',     result.birthChartData?.ascendant?.rashiName ? `${result.birthChartData.ascendant.rashiName} (Lagna)` : result.moon],
                ['Age',             `${result.age} years`],
                ['Element',         result.data?.element],
                ['Ruling Planet',   result.data?.planet],
                ['Lucky Number',    result.data?.luckyNum],
                ['Lucky Color',     result.data?.color],
                ['Lucky Gemstone',  result.data?.gem],
                ['Best Days',       result.data?.luckyDays],
                ['Current Dasha',   result.birthChartData?.dasha?.current?.planet
                                      ? `${result.birthChartData.dasha.current.planet} Mahadasha`
                                      : result.data?.dasha],
                ['Nakshatra',       result.birthChartData?.nakshatra?.name
                                      ? `${result.birthChartData.nakshatra.name} · Pada ${result.birthChartData.nakshatra.pada}`
                                      : '—'],
              ].map(([label, val]) => (
                <div key={label} className="pred-result__row">
                  <span>{label}</span>
                  <strong>{val}</strong>
                </div>
              ))}
            </div>

            {/* ── LLM Prediction ── */}
            <LLMPredictionDisplay prediction={llmPrediction} loading={llmLoading} />

            {/* South Indian Rasi Chart */}
            <RasiChart sunSign={result.sign} />

            {/* ── North Indian Janma Kundali ── */}
            {result.birthChartData && <BirthChart chartData={result.birthChartData} />}

            {/* Share and CTA */}
            {llmPrediction && (
              <>
                <SharePredictionCard 
                  name={result.name}
                  zodiacSign={result.sign}
                  moonSign={result.moon}
                  lagna={result.birthChartData?.ascendant?.rashiName || 'Unknown'}
                  currentDasha={result.birthChartData?.dasha?.current?.planet || 'Unknown'}
                  tagline={llmPrediction.summaryTagline}
                />
                <FreeConsultCTA />
              </>
            )}

            <button className="pred-result__reset" onClick={reset}>{t('result.newPrediction')}</button>
          </div>
        )}
      </div>
    </section>
  );
}
