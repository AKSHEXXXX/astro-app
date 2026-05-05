import React from 'react';
import { useTranslation } from 'react-i18next';

const sectionStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '0.5px solid rgba(201,161,74,0.2)',
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '12px'
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#c9a14a',
  marginBottom: '10px'
};

const textStyle = {
  fontSize: '15px',
  color: 'rgba(245,239,224,0.85)',
  lineHeight: '1.75'
};

export function LLMPredictionDisplay({ prediction, loading }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(245,239,224,0.5)' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>☽</div>
        <p style={{ fontSize: '14px' }}>{t('llmDisplay.loadingTitle')}</p>
        <p style={{ fontSize: '12px', marginTop: '6px', opacity: 0.6 }}>{t('llmDisplay.loadingSub')}</p>
      </div>
    );
  }

  if (!prediction) return null;

  return (
    <div>
      {/* Tagline */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        marginBottom: '16px',
        background: 'rgba(201,161,74,0.08)',
        borderRadius: '12px',
        border: '0.5px solid rgba(201,161,74,0.3)'
      }}>
        <p style={{ fontSize: '17px', fontStyle: 'italic', color: '#c9a14a', lineHeight: 1.5 }}>
          "{prediction.summaryTagline}"
        </p>
      </div>

      {/* Personality */}
      <div style={sectionStyle}>
        <div style={labelStyle}>✦ {t('llmDisplay.personality')}</div>
        <p style={textStyle}>{prediction.personalityInsight}</p>
      </div>

      {/* Current Phase / Dasha */}
      <div style={sectionStyle}>
        <div style={labelStyle}>✦ {t('llmDisplay.currentPhase')}</div>
        <p style={textStyle}>{prediction.currentPhase}</p>
      </div>

      {/* Career & Finance */}
      <div style={sectionStyle}>
        <div style={labelStyle}>✦ {t('llmDisplay.career')}</div>
        <p style={textStyle}>{prediction.careerFinance}</p>
      </div>

      {/* Relationships & Health */}
      <div style={sectionStyle}>
        <div style={labelStyle}>✦ {t('llmDisplay.relationships')}</div>
        <p style={textStyle}>{prediction.relationshipsHealth}</p>
      </div>

      {/* Remedies */}
      {prediction.keyRemedies && prediction.keyRemedies.length > 0 && (
        <div style={sectionStyle}>
          <div style={labelStyle}>✦ {t('llmDisplay.remedies')}</div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {prediction.keyRemedies.map((r, i) => (
              <li key={i} style={{
                display: 'flex', gap: '10px', alignItems: 'flex-start',
                padding: '6px 0',
                borderBottom: i < prediction.keyRemedies.length - 1 ? '0.5px solid rgba(201,161,74,0.1)' : 'none',
                color: 'rgba(245,239,224,0.8)', fontSize: '14px', lineHeight: 1.5
              }}>
                <span style={{ color: '#c9a14a', flexShrink: 0 }}>✦</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Auspicious Advice */}
      <div style={sectionStyle}>
        <div style={labelStyle}>✦ {t('llmDisplay.auspicious')}</div>
        <p style={textStyle}>{prediction.auspiciousAdvice}</p>
      </div>
    </div>
  );
}
