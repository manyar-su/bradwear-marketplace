
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StoreProvider } from './context/StoreContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const loadAnalytics = () => {
  import('@vercel/analytics')
    .then(({ inject }) => inject())
    .catch(() => {});
};

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(loadAnalytics, { timeout: 3000 });
} else {
  window.setTimeout(loadAnalytics, 2000);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
