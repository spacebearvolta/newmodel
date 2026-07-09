import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsSidebar } from './SettingsSidebar';
import type { SettingsPage } from './SettingsSidebar';
import { MyMeetingsNew } from './MyMeetingsNew';
import { Preferences } from './Preferences';
import { DesktopNotifications } from './Desktop';
import { EmailNotifications } from './Email';
import { TweaksPanel, TweakSection, TweakButton } from '../tweaks/TweaksPanel';

export function SettingsApp() {
  const navigate = useNavigate();
  const [page, setPage] = useState<SettingsPage>('my-meetings');
  const backToPreferences = () => setPage('preferences');

  let body;
  if (page === 'preferences') body = <Preferences onDesktop={() => setPage('desktop')} onEmail={() => setPage('email')} />;
  else if (page === 'desktop') body = <DesktopNotifications onBack={backToPreferences} />;
  else if (page === 'email') body = <EmailNotifications onBack={backToPreferences} />;
  else body = <MyMeetingsNew />;

  // Desktop/Email are subpages of Preferences — keep the sidebar highlighting
  // "Preferences" while viewing either, matching the original's nav grouping.
  const sidebarActive = page === 'desktop' || page === 'email' ? 'preferences' : page;

  return (
    <div className="mac-shell">
      <div className="mac-shell__window">
        <div className="mac-titlebar">
          <div className="mac-traffic"><span /><span /><span /></div>
          <div className="mac-titlebar__title">Settings — Grain</div>
        </div>
        <div className="mac-body">
          <div className="gr-app" style={{ height: '100%', minHeight: 0 }}>
            <SettingsSidebar active={sidebarActive} onNav={setPage} onBack={() => navigate('/')} />
            <main className="gr-main">{body}</main>
          </div>
        </div>
      </div>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Review">
          <TweakButton label="▶ Hook gallery" onClick={() => { window.location.href = '/hook-gallery'; }} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}
