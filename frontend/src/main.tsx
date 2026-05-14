import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './shared/styles/index.css';
import { App } from './app/App';
import { I18nProvider } from './shared/i18n';

const root = document.getElementById('app');

if (!root) {
  throw new Error('App root element was not found.');
}

createRoot(root).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
);
