import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Analytics } from '@vercel/analytics/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './shared/config/i18n';
import { trackPageView } from './shared/lib/trackEvent';

// Track initial page load
trackPageView('calculator');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);
