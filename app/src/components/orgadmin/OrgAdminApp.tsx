// OrgAdminApp.tsx — Organization admin driver: sidebar nav + routed content.
import { useNavigate } from 'react-router-dom';
import { OrgAdminSidebar, ORG_TEAMS } from './OrgAdminSidebar';
import { OrgAdminStub, OrgAdminGeneral } from './OrgAdminStub';
import { OrgAdminMyMeetings } from './OrgAdminMyMeetings';
import { OrgAdminTeam } from './OrgAdminTeam';
import { TweaksPanel, TweakSection, TweakRadio, TweakToggle, useTweaks } from '../tweaks/TweaksPanel';

interface PageMeta { title: string; icon: string }

// Map each sidebar id to its page title + icon (used for stub pages).
const PAGE_META: Record<string, PageMeta> = {
  general: { title: 'General', icon: 'settings' },
  meetings: { title: 'Meetings', icon: 'video' },
  members: { title: 'Members', icon: 'users' },
  teams: { title: 'Teams', icon: 'users' },
  templates: { title: 'Templates', icon: 'fileText' },
  scorecards: { title: 'Scorecards', icon: 'clipboardList' },
  trackers: { title: 'Trackers', icon: 'tag' },
  billing: { title: 'Billing', icon: 'creditCard' },
  plans: { title: 'Plans', icon: 'upgradeCircle' },
  mcp: { title: 'MCP Clients', icon: 'squareTerminal' },
  api: { title: 'API', icon: 'codeXml' },
  hubspot: { title: 'HubSpot', icon: 'plug' },
  slack: { title: 'Slack', icon: 'plug' },
  aircall: { title: 'Aircall', icon: 'phone' },
  salesforce: { title: 'Salesforce', icon: 'cloud' },
  zapier: { title: 'Zapier', icon: 'zap' },
};

interface Tweaks {
  density: 'comfortable' | 'compact';
  wrapInMacChrome: boolean;
  active: string;
}

export function OrgAdminApp() {
  const navigate = useNavigate();
  const [t, setT] = useTweaks<Tweaks>({ density: 'comfortable', wrapInMacChrome: true, active: 'general' });
  const active = t.active;
  const setActive = (id: string) => setT('active', id);
  const goBack = () => navigate('/');

  let page;
  if (active === 'general') {
    page = <OrgAdminGeneral />;
  } else if (active === 'meetings') {
    page = <OrgAdminMyMeetings showArtboard={false} orgAdmin />;
  } else if (active.startsWith('team-')) {
    page = <OrgAdminTeam team={ORG_TEAMS.find((tm) => tm.id === active)} />;
  } else {
    page = <OrgAdminStub title={PAGE_META[active]?.title || active} icon={PAGE_META[active]?.icon} />;
  }

  const inner = (
    <div className={`gr-app ${t.density === 'compact' ? 'density-compact' : ''}`} style={{ height: '100%', minHeight: 0 }}>
      <OrgAdminSidebar active={active} onNav={setActive} onBack={goBack} />
      <main className="gr-main">
        <div key={active}>{page}</div>
      </main>
    </div>
  );

  return (
    <>
      {t.wrapInMacChrome ? (
        <div className="mac-shell">
          <div className="mac-shell__window">
            <div className="mac-titlebar">
              <div className="mac-traffic"><span /><span /><span /></div>
              <div className="mac-titlebar__title">Organization admin — Grain</div>
            </div>
            <div className="mac-body">{inner}</div>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: '100vh' }}>{inner}</div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Presentation">
          <TweakRadio
            label="Density"
            value={t.density}
            onChange={(v) => setT('density', v)}
            options={[{ value: 'comfortable', label: 'Cozy' }, { value: 'compact', label: 'Compact' }]}
          />
          <TweakToggle label="Mac chrome" value={t.wrapInMacChrome} onChange={(v) => setT('wrapInMacChrome', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
