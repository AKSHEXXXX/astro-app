import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    // Only init if the key is present
    if (import.meta.env.VITE_POSTHOG_KEY) {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: false,
      });
    } else {
      console.warn("PostHog key not found in env variables.");
    }
  }
};

export const track = (event, properties) => {
  if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
    posthog.capture(event, properties);
  } else {
    console.log(`Mock track event: ${event}`, properties);
  }
};
