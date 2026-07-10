// IntegrationsApp.tsx — Personal / Profile › Integrations settings page.
// On the free plan, every third-party integration is gated behind a Grain
// Business trial. MCP Clients & API are available on every plan.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../primitives/Icon';
import { UpgradeGateCardV2Live } from '../hooksV2/HooksV2Live';
import { Toast } from '../shell/Toast';
import { TweaksPanel, TweakSection, TweakButton, TweakRadio, TweakSelect, TweakToggle, useTweaks, readShowParam } from '../tweaks/TweaksPanel';

interface NavRow {
  id: string;
  label: string;
  icon?: string;
  avatar?: string;
  brand?: string;
  initial?: string;
}
interface NavGroup { group: string; rows: NavRow[] }

const INTG_NAV: NavGroup[] = [
  { group: '', rows: [
    { id: 'members', label: 'Members', icon: 'users' },
    { id: 'billing', label: 'Billing', icon: 'receipt' },
    { id: 'plans', label: 'Plans', icon: 'upgradeCircle' },
  ] },
  { group: 'Teams', rows: [
    { id: 'cartwheels', label: 'Cartwheels', avatar: '#64748B', initial: 'C' },
    { id: 'new-team', label: 'New team', icon: 'plus' },
  ] },
  { group: 'Account', rows: [
    { id: 'my-account', label: 'My Account', icon: 'circleUserRound' },
    { id: 'my-meetings', label: 'My Meetings', icon: 'video' },
    { id: 'app', label: 'App', icon: 'appWindow' },
  ] },
  { group: 'Integrations', rows: [
    { id: 'mcp', label: 'MCP Clients', icon: 'squareTerminal' },
    { id: 'api', label: 'API', icon: 'codeXml' },
    { id: 'zoom', label: 'Zoom', brand: '#2D8CFF', initial: 'Z' },
    { id: 'slack', label: 'Slack', brand: '#4A154B', initial: 'S' },
    { id: 'hubspot', label: 'HubSpot', brand: '#FF7A59', initial: 'H' },
    { id: 'aircall', label: 'Aircall', brand: '#00B388', initial: 'A' },
    { id: 'salesforce', label: 'Salesforce', brand: '#00A1E0', initial: 'S' },
    { id: 'productboard', label: 'Productboard', brand: '#FF2D55', initial: 'P' },
    { id: 'zapier', label: 'Zapier', brand: '#FF4F00', initial: 'Z' },
  ] },
];

const INTG_INFO: Record<string, { name: string; desc: string }> = {
  zoom: { name: 'Zoom', desc: 'Import your Zoom cloud recordings automatically: Grain transcribes and summarizes every call.' },
  slack: { name: 'Slack', desc: 'Share meeting summaries and clips to Slack channels the moment a call wraps.' },
  hubspot: { name: 'HubSpot', desc: 'Skip the manual data entry, auto-sync AI notes to HubSpot Contact and Meeting objects.' },
  aircall: { name: 'Aircall', desc: 'Record, transcribe, and summarize your Aircall conversations alongside your meetings.' },
  salesforce: { name: 'Salesforce', desc: 'Push call summaries and next steps straight to Salesforce Opportunities and Contacts.' },
  productboard: { name: 'Productboard', desc: 'Send product feedback and feature requests from your calls into Productboard.' },
  zapier: { name: 'Zapier', desc: 'Connect Grain to thousands of apps and automate your post-meeting workflows.' },
};

const INTG_FREE: Record<string, { name: string; desc: string }> = {
  mcp: { name: 'MCP Clients', desc: 'Connect Grain to Claude and other MCP clients to use your meetings as live context in your AI workflows.' },
  api: { name: 'API', desc: 'Build on top of Grain: pull transcripts, summaries, and meeting data into your own tools.' },
};

const ROW_BY_ID: Record<string, NavRow> = {};
INTG_NAV.forEach((g) => g.rows.forEach((r) => { ROW_BY_ID[r.id] = r; }));

function IntgGlyph({ row, size = 18 }: { row?: NavRow; size?: number }) {
  if (!row) return null;
  if (row.brand) {
    return <span className="intg-brand" style={{ background: row.brand, width: size, height: size, fontSize: Math.round(size * 0.55) }}>{row.initial}</span>;
  }
  if (row.avatar) {
    return <span className="intg-brand" style={{ background: row.avatar, width: size, height: size, fontSize: Math.round(size * 0.55) }}>{row.initial}</span>;
  }
  return <Icon name={row.icon || 'wrench'} size={16} />;
}

function IntegrationsSettings({ plan, initial, onStartTrial, onBack, onConnect }: {
  plan: 'free' | 'business'; initial: string; onStartTrial: () => void; onBack: () => void; onConnect?: () => void;
}) {
  const [active, setActive] = useState(initial);
  useEffect(() => { setActive(initial); }, [initial]);

  const freeInfo = INTG_FREE[active];
  const paidInfo = INTG_INFO[active];
  const activeRow = ROW_BY_ID[active];

  let card;
  if (freeInfo) {
    card = (
      <div className="intg-card">
        <span className="intg-card__logo intg-card__logo--neutral"><IntgGlyph row={activeRow} size={30} /></span>
        <h2 className="intg-card__title">{freeInfo.name} is available on your plan</h2>
        <p className="intg-card__desc">{freeInfo.desc}</p>
        <div className="intg-card__actions">
          <a className="intg-card__learn" href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
          <button className="gr-btn gr-btn--dark gr-btn--md" onClick={(e) => e.preventDefault()}>Set up</button>
        </div>
      </div>
    );
  } else if (paidInfo && plan === 'business') {
    card = (
      <div className="intg-card">
        <span className="intg-card__logo" style={{ background: activeRow?.brand }}>{activeRow?.initial}</span>
        <h2 className="intg-card__title">Connect {paidInfo.name}</h2>
        <p className="intg-card__desc">{paidInfo.desc}</p>
        <div className="intg-trial-chip"><Icon name="sparkles" size={14} /> Workspace integrations are a Business feature. Connect {paidInfo.name} while your trial is active.</div>
        <div className="intg-card__actions">
          <a className="intg-card__learn" href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
          <button className="gr-btn gr-btn--primary gr-btn--md" onClick={(e) => { e.preventDefault(); onConnect?.(); }}>Connect {paidInfo.name}</button>
        </div>
      </div>
    );
  } else if (paidInfo) {
    card = (
      <UpgradeGateCardV2Live
        title={`Upgrade your plan to connect ${paidInfo.name}`}
        desc={paidInfo.desc}
        onLearnMore={() => {}}
        onUpgrade={onStartTrial}
      />
    );
  } else {
    card = (
      <div className="intg-card intg-card--placeholder">
        <h2 className="intg-card__title">{activeRow?.label}</h2>
        <p className="intg-card__desc">This section isn't part of this prototype.</p>
      </div>
    );
  }

  return (
    <div className="intg-app">
      <aside className="intg-side">
        <div className="intg-side__head">
          <a className="intg-back" href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
            <Icon name="chevLeft" size={14} /> Back to app
          </a>
        </div>
        <nav className="intg-nav">
          {INTG_NAV.map((g, gi) => (
            <div key={gi} className="intg-group">
              {g.group && <div className="intg-groupTitle">{g.group}</div>}
              {g.rows.map((r) => (
                <button key={r.id} className={`intg-item ${active === r.id ? 'is-active' : ''}`} onClick={() => setActive(r.id)}>
                  <IntgGlyph row={r} />
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main className="intg-mainwrap">
        <div className="intg-breadcrumb">Integrations</div>
        <div className="intg-center">{card}</div>
      </main>
    </div>
  );
}

interface Tweaks {
  plan: 'free' | 'business';
  integration: string;
  wrapInMacChrome: boolean;
}

export function IntegrationsApp() {
  const navigate = useNavigate();
  const [t, setT] = useTweaks<Tweaks>({ plan: 'free', integration: 'hubspot', wrapInMacChrome: true });

  const startTrial = () => navigate('/');
  const goBack = () => navigate('/');

  // H8 feature-usage nudge: connecting an integration during the trial fires a
  // contextual toast (same shape as sharing / AI-action nudges).
  const [toast, setToast] = useState<string | null>(null);
  const fireConnectToast = () => {
    setToast('Workspace integrations are a Grain Business feature — full access during your trial.');
    setTimeout(() => setToast(null), 3400);
  };
  useEffect(() => {
    if (readShowParam() === 'nudge' && t.plan === 'business') fireConnectToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inner = <IntegrationsSettings plan={t.plan} initial={t.integration} onStartTrial={startTrial} onBack={goBack} onConnect={fireConnectToast} />;

  return (
    <>
      {t.wrapInMacChrome ? (
        <div className="mac-shell">
          <div className="mac-shell__window">
            <div className="mac-titlebar">
              <div className="mac-traffic"><span /><span /><span /></div>
              <div className="mac-titlebar__title">Settings — Grain</div>
            </div>
            <div className="mac-body">{inner}</div>
          </div>
        </div>
      ) : (
        <div style={{ height: '100vh' }}>{inner}</div>
      )}
      {toast && <Toast>{toast}</Toast>}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Review">
          <TweakButton label="▶ Hook gallery" onClick={() => { window.location.href = '/hook-gallery'; }} />
        </TweakSection>
        <TweakSection label="State">
          <TweakRadio
            label="Plan"
            value={t.plan}
            onChange={(v) => setT('plan', v)}
            options={[{ value: 'free', label: 'Free' }, { value: 'business', label: 'Business' }]}
          />
          <TweakSelect
            label="Integration"
            value={t.integration}
            onChange={(v) => setT('integration', v)}
            options={[
              { value: 'hubspot', label: 'HubSpot' },
              { value: 'salesforce', label: 'Salesforce' },
              { value: 'zoom', label: 'Zoom' },
              { value: 'slack', label: 'Slack' },
              { value: 'aircall', label: 'Aircall' },
              { value: 'productboard', label: 'Productboard' },
              { value: 'zapier', label: 'Zapier' },
              { value: 'mcp', label: 'MCP Clients' },
              { value: 'api', label: 'API' },
            ]}
          />
        </TweakSection>
        <TweakSection label="Presentation">
          <TweakToggle label="Mac chrome" value={t.wrapInMacChrome} onChange={(v) => setT('wrapInMacChrome', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
