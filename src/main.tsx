// Ensure window.fetch has both getter and setter in sandboxed iframe environments
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e && e.message && (e.message.includes('Cannot set property fetch') || e.message.includes('fetch of #<Window>'))) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      return true;
    }
  }, true);

  window.addEventListener('unhandledrejection', (e: any) => {
    const msg = e && e.reason && (e.reason.message || String(e.reason));
    if (msg && (msg.includes('Cannot set property fetch') || msg.includes('fetch of #<Window>') || msg.includes('WebSocket') || msg.includes('websocket'))) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
  }, true);

  try {
    const realFetch = window.fetch;
    let boundFetch = typeof realFetch === 'function' ? realFetch.bind(window) : realFetch;
    const getFetch = () => boundFetch;
    const setFetch = (fn: any) => {
      if (typeof fn === 'function') {
        boundFetch = fn.bind(window);
      } else {
        boundFetch = fn;
      }
    };

    const winProto = typeof Window !== 'undefined' && Window.prototype;
    if (winProto) {
      try {
        Object.defineProperty(winProto, 'fetch', {
          get: getFetch,
          set: setFetch,
          configurable: true,
          enumerable: true,
        });
      } catch (_) {}
    }

    try {
      Object.defineProperty(window, 'fetch', {
        get: getFetch,
        set: setFetch,
        configurable: true,
        enumerable: true,
      });
    } catch (_) {}
  } catch (_) {}
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
