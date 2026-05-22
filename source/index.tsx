import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import runDevCleanup from './utils/devCleanup';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Run cleanup asynchronously but don't block initial render
runDevCleanup().catch(() => {});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);