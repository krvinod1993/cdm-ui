import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider as DealerAuthProvider } from './shared/contexts/AuthContext.jsx';
import { AuthProvider as PublicAuthProvider } from './shared/contexts/AuthContext.tsx';
import { ToastProvider } from './shared/contexts/ToastContext.jsx';
import { ThemeProvider } from './shared/contexts/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <PublicAuthProvider>
            <DealerAuthProvider>
              <App />
            </DealerAuthProvider>
          </PublicAuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);

