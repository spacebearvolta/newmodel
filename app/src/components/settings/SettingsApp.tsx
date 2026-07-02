import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsSidebar } from './SettingsSidebar';
import type { SettingsPage } from './SettingsSidebar';
import { MyMeetingsNew } from './MyMeetingsNew';
import { Preferences } from './Preferences';

export function SettingsApp() {
  const navigate = useNavigate();
  const [page, setPage] = useState<SettingsPage>('my-meetings');

  const body = page === 'preferences' ? <Preferences /> : <MyMeetingsNew />;

  return (
    <div className="mac-shell">
      <div className="mac-shell__window">
        <div className="mac-titlebar">
          <div className="mac-traffic"><span /><span /><span /></div>
          <div className="mac-titlebar__title">Settings — Grain</div>
        </div>
        <div className="mac-body">
          <div className="gr-app" style={{ height: '100%', minHeight: 0 }}>
            <SettingsSidebar active={page} onNav={setPage} onBack={() => navigate('/')} />
            <main className="gr-main">{body}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
