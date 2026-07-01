// IntegrationsSettings.jsx — Personal / Profile › Integrations settings page.
//
// Recreates the production Integrations screen (see reference screenshot).
// On the free plan, every third-party integration is gated behind a Grain
// Business trial — free accounts get zero CRM/workspace connections. MCP
// Clients & API are available on every plan.
//
// A "Plan" tweak flips between the free (gated) and Business (connect) states
// so the gate can be reviewed both ways.

const INTG_NAV = [
{ group: '', rows: [
  { id: 'members', label: 'Members', icon: 'users' },
  { id: 'billing', label: 'Billing', icon: 'receipt' },
  { id: 'plans', label: 'Plans', icon: 'circle-arrow-up' }]
},
{ group: 'Teams', rows: [
  { id: 'cartwheels', label: 'Cartwheels', avatar: '#64748B', initial: 'C' },
  { id: 'new-team', label: 'New team', icon: 'plus' }]
},
{ group: 'Account', rows: [
  { id: 'my-account', label: 'My Account', icon: 'circle-user-round' },
  { id: 'my-meetings', label: 'My Meetings', icon: 'video' },
  { id: 'app', label: 'App', icon: 'app-window' }]
},
{ group: 'Integrations', rows: [
  { id: 'mcp', label: 'MCP Clients', icon: 'square-terminal' },
  { id: 'api', label: 'API', icon: 'code-xml' },
  { id: 'zoom', label: 'Zoom', brand: '#2D8CFF', initial: 'Z' },
  { id: 'slack', label: 'Slack', brand: '#4A154B', initial: 'S' },
  { id: 'hubspot', label: 'HubSpot', brand: '#FF7A59', initial: 'H' },
  { id: 'aircall', label: 'Aircall', brand: '#00B388', initial: 'A' },
  { id: 'salesforce', label: 'Salesforce', brand: '#00A1E0', initial: 'S' },
  { id: 'productboard', label: 'Productboard', brand: '#FF2D55', initial: 'P' },
  { id: 'zapier', label: 'Zapier', brand: '#FF4F00', initial: 'Z' }]
}];


// Third-party integrations — gated on free, connectable on Business.
const INTG_INFO = {
  zoom: { name: 'Zoom', desc: 'Import your Zoom cloud recordings automatically — Grain transcribes and summarizes every call.' },
  slack: { name: 'Slack', desc: 'Share meeting summaries and clips to Slack channels the moment a call wraps.' },
  hubspot: { name: 'HubSpot', desc: 'Skip the manual data entry, auto-sync AI notes to HubSpot Contact and Meeting objects.' },
  aircall: { name: 'Aircall', desc: 'Record, transcribe, and summarize your Aircall conversations alongside your meetings.' },
  salesforce: { name: 'Salesforce', desc: 'Push call summaries and next steps straight to Salesforce Opportunities and Contacts.' },
  productboard: { name: 'Productboard', desc: 'Send product feedback and feature requests from your calls into Productboard.' },
  zapier: { name: 'Zapier', desc: 'Connect Grain to thousands of apps and automate your post-meeting workflows.' }
};

// Available on every plan.
const INTG_FREE = {
  mcp: { name: 'MCP Clients', desc: 'Connect Grain to Claude and other MCP clients to use your meetings as live context in your AI workflows.' },
  api: { name: 'API', desc: 'Build on top of Grain — pull transcripts, summaries, and meeting data into your own tools.' }
};

const ROW_BY_ID = {};
INTG_NAV.forEach((g) => g.rows.forEach((r) => {ROW_BY_ID[r.id] = r;}));

// Value props for the gated upgrade card — mirrors the in-app upgrade modals.
const INTG_VALUE_POINTS = [
  { icon: 'infinity', label: 'No 45-minute recording cap' },
  { icon: 'history',  label: 'Unlimited meeting history' },
  { icon: 'plug',     label: 'Connect HubSpot, Salesforce, Slack & more' },
  { icon: 'users',    label: 'A shared library your whole team can search' },
];

function IntgGlyph({ row, size = 18 }) {
  if (row.brand) {
    return (
      <span className="intg-brand" style={{ background: row.brand, width: size, height: size, fontSize: Math.round(size * 0.55) }}>
        {row.initial}
      </span>);

  }
  if (row.avatar) {
    return (
      <span className="intg-brand" style={{ background: row.avatar, width: size, height: size, fontSize: Math.round(size * 0.55) }}>
        {row.initial}
      </span>);

  }
  return <i data-lucide={row.icon} />;
}

function IntegrationsSettings({ plan = 'free', initial = 'hubspot', onStartTrial }) {
  const [active, setActive] = React.useState(initial);
  React.useEffect(() => {setActive(initial);}, [initial]);
  React.useEffect(() => {if (window.lucide) window.lucide.createIcons();});

  const freeInfo = INTG_FREE[active];
  const paidInfo = INTG_INFO[active];

  let card;
  if (freeInfo) {
    // MCP / API — available on every plan.
    card =
    <div className="intg-card">
        <span className="intg-card__logo intg-card__logo--neutral"><IntgGlyph row={ROW_BY_ID[active]} size={30} /></span>
        <h2 className="intg-card__title">{freeInfo.name} is available on your plan</h2>
        <p className="intg-card__desc">{freeInfo.desc}</p>
        <div className="intg-card__actions">
          <a className="intg-card__learn" href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
          <button className="gr-btn gr-btn--dark gr-btn--md" onClick={(e) => e.preventDefault()}>Set up</button>
        </div>
      </div>;

  } else if (paidInfo && plan === 'business') {
    // Business — the integration is connectable.
    card =
    <div className="intg-card">
        <span className="intg-card__logo" style={{ background: ROW_BY_ID[active].brand }}>{ROW_BY_ID[active].initial}</span>
        <h2 className="intg-card__title">Connect {paidInfo.name}</h2>
        <p className="intg-card__desc">{paidInfo.desc}</p>
        <div className="intg-trial-chip"><i data-lucide="sparkles" /> Workspace integrations are a Business feature — connect {paidInfo.name} while your trial is active.</div>
        <div className="intg-card__actions">
          <a className="intg-card__learn" href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
          <button className="gr-btn gr-btn--primary gr-btn--md" onClick={(e) => e.preventDefault()}>Connect {paidInfo.name}</button>
        </div>
      </div>;

  } else if (paidInfo) {
    // Free — gated behind a Business trial.
    card =
    <div className="intg-card">
        <div className="intg-card__eyebrow"><i data-lucide="sparkles" /> Grain Business · free for 14 days</div>
        <span className="intg-card__logo" style={{ background: ROW_BY_ID[active].brand }}>{ROW_BY_ID[active].initial}</span>
        <h2 className="intg-card__title">Try Grain Business to connect {paidInfo.name}</h2>
        <p className="intg-card__desc">{paidInfo.desc}</p>
        <ul className="intg-values">
          {INTG_VALUE_POINTS.map((p) => (
            <li key={p.label}><span className="intg-values__icon"><i data-lucide={p.icon} /></span><span>{p.label}</span></li>
          ))}
        </ul>
        <div className="intg-card__actions">
          <a className="intg-card__learn" href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
          <button className="gr-btn gr-btn--dark gr-btn--md" onClick={onStartTrial}>Start free trial</button>
        </div>
        <p className="intg-card__note">Start a free 14 day Grain Business trial to connect a CRM integration.</p>
      </div>;

  } else {
    // Non-integration nav rows (Members / Billing / Teams / …) — out of scope
    // for this prototype; show a gentle placeholder.
    card =
    <div className="intg-card intg-card--placeholder">
        <h2 className="intg-card__title">{ROW_BY_ID[active]?.label}</h2>
        <p className="intg-card__desc">This section isn’t part of this prototype.</p>
      </div>;

  }

  return (
    <div className="intg-app">
      <aside className="intg-side" data-screen-label="Integrations settings — sidebar">
        <div className="intg-side__head">
          <a className="intg-back" href="Meetings.html?app"><i data-lucide="chevron-left" /> Back to app</a>
        </div>
        <nav className="intg-nav">
          {INTG_NAV.map((g, gi) =>
          <div key={gi} className="intg-group">
              {g.group && <div className="intg-groupTitle">{g.group}</div>}
              {g.rows.map((r) =>
            <button
              key={r.id}
              className={`intg-item ${active === r.id ? 'is-active' : ''}`}
              onClick={() => setActive(r.id)}>
                  <IntgGlyph row={r} />
                  <span>{r.label}</span>
                </button>
            )}
            </div>
          )}
        </nav>
      </aside>
      <main className="intg-mainwrap">
        <div className="intg-breadcrumb">Integrations</div>
        <div className="intg-center" data-screen-label={`Integrations — ${ROW_BY_ID[active]?.label}`}>
          {card}
        </div>
      </main>
    </div>);

}

Object.assign(window, { IntegrationsSettings });