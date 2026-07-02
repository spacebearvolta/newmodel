import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/tokens-app.css';
import './styles/base.css';
import './styles/shell.css';
import './styles/meetings.css';
import './styles/onboarding.css';
import './styles/settingsApp.css';
import './styles/settingsPage.css';
import './styles/integrations.css';
import './styles/orgadmin.css';
import './styles/emailMocks.css';
import './styles/hooks.css';
import './styles/hookGallery.css';
import './styles/tokens-v2.css';
import './redesign/redesign.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
