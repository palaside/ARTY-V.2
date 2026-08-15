import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles.css';
import { SharedOperationalProvider } from '@/shared/state/shared-operational-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SharedOperationalProvider>
      <App />
    </SharedOperationalProvider>
  </React.StrictMode>,
);
