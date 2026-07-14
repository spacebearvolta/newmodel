import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RootGate } from './routes/RootGate';
import { OnboardingApp } from './components/onboarding/OnboardingApp';
import { SettingsApp } from './components/settings/SettingsApp';
import { IntegrationsApp } from './components/integrations/IntegrationsApp';
import { OrgAdminApp } from './components/orgadmin/OrgAdminApp';
import { HookGalleryRoute } from './routes/HookGalleryRoute';
import { EmailMocksRoute } from './routes/EmailMocksRoute';
import { RecordApp } from './components/record/RecordApp';
import { LiveRecordApp } from './components/record/LiveRecordApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootGate />} />
        <Route path="/onboarding" element={<OnboardingApp />} />
        <Route path="/settings" element={<SettingsApp />} />
        <Route path="/integrations" element={<IntegrationsApp />} />
        <Route path="/org-admin" element={<OrgAdminApp />} />
        <Route path="/record" element={<RecordApp />} />
        <Route path="/live" element={<LiveRecordApp />} />
        <Route path="/hook-gallery" element={<HookGalleryRoute />} />
        <Route path="/trial-emails" element={<EmailMocksRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
