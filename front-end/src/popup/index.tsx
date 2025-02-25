import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup';
import { AppQueryClientProvider } from '../providers/QueryClientProvider';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppQueryClientProvider>
      <Popup />
    </AppQueryClientProvider>
  </React.StrictMode>
);