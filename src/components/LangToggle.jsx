import React from 'react';
import { useTranslation } from 'react-i18next';
import { track } from '../posthog.js';

export default function LangToggle() {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language.startsWith('en') ? 'hi' : 'en';
    track('language_switched', { from: i18n.language, to: next });
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      style={{
        background: 'rgba(201,161,74,0.1)',
        border: '0.5px solid rgba(201,161,74,0.4)',
        color: '#c9a14a',
        padding: '5px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        letterSpacing: '0.04em',
        marginLeft: '15px'
      }}
    >
      {i18n.language.startsWith('en') ? 'हिंदी' : 'English'}
    </button>
  );
}
