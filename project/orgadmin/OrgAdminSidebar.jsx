// OrgAdminSidebar.jsx — Sidebar for the Org admin settings area.
// Groups: Admin, Teams (fixed section), Integrations.
// `active` is a string id; `onNav` is called when an item is clicked.

// Teams live only in organization settings. Icons + colors come from the
// Grain DS team set (MS_POPOVER_TEAMS); member counts from the Members admin.
const ORG_TEAMS = [
  { id: 'team-grain', label: 'Grain',            icon: 'globe',       iconColor: '#9747FF', members: 88 },
  { id: 'team-sales', label: 'Sales',            icon: 'dollar-sign', iconColor: '#16A35F', members: 3 },
  { id: 'team-cs',    label: 'Customer Success', icon: 'heart',       iconColor: '#EA580C', members: 2 },
  { id: 'team-exec',  label: 'Executive Team',   icon: 'trophy',      iconColor: '#B45309', members: 3 },
  { id: 'team-new',   label: 'New Team',         icon: 'circle-play', iconColor: '#0052B4', members: 3 },
];

function OrgAdminSidebar({ active = 'general', onNav }) {
  const groups = [
    {
      group: 'Admin',
      rows: [
        { id: 'general',    label: 'General',    icon: 'settings' },
        { id: 'meetings',   label: 'Meetings',   icon: 'video' },
        { id: 'members',    label: 'Members',    icon: 'users' },
        { id: 'templates',  label: 'Templates',  icon: 'file-text' },
        { id: 'scorecards', label: 'Scorecards', icon: 'clipboard-list' },
        { id: 'trackers',   label: 'Trackers',   icon: 'tag' },
        { id: 'billing',    label: 'Billing',    icon: 'credit-card' },
        { id: 'plans',      label: 'Plans',      icon: 'arrow-up-circle' },
      ],
    },
    {
      group: 'Teams',
      rows: [
        ...ORG_TEAMS,
        { id: 'team-create', label: 'New team', icon: 'plus' },
      ],
    },
    {
      group: 'Integrations',
      rows: [
        { id: 'mcp',        label: 'MCP Clients', icon: 'terminal-square' },
        { id: 'api',        label: 'API',         icon: 'code-2' },
        { id: 'hubspot',    label: 'HubSpot',     brand: '#FF7A59', initial: 'H' },
        { id: 'slack',      label: 'Slack',       brand: '#4A154B', initial: 'S' },
        { id: 'aircall',    label: 'Aircall',     brand: '#00B388', initial: 'A' },
        { id: 'salesforce', label: 'Salesforce',  brand: '#00A1E0', initial: 'S' },
        { id: 'zapier',     label: 'Zapier',      brand: '#FF4F00', initial: 'Z' },
      ],
    },
  ];

  const Item = ({ r }) => (
    <a
      href={`#/${r.id}`}
      className={`gr-sidebar__item ${active === r.id ? 'is-active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        // "New team" is an action stub, not a prototyped route.
        if (r.id === 'team-create') return;
        onNav && onNav(r.id);
      }}
    >
      {r.brand ? (
        <span
          className="oa-brand"
          style={{ background: r.brand }}
          aria-hidden="true"
        >
          {r.initial}
        </span>
      ) : r.iconColor ? (
        <span style={{ color: r.iconColor, display: 'inline-flex' }} aria-hidden="true">
          <i data-lucide={r.icon} />
        </span>
      ) : (
        <i data-lucide={r.icon} />
      )}
      <span>{r.label}</span>
    </a>
  );

  return (
    <aside className="gr-sidebar">
      <div className="gr-sidebar__head">
        <a className="gr-sidebar__back" href="Meetings.html">
          <i data-lucide="chevron-left" /> Back to app
        </a>
      </div>
      <nav className="gr-sidebar__nav">
        {groups.map((g, gi) => (
          <div key={gi} className="gr-sidebar__group">
            {g.group && <div className="gr-sidebar__groupTitle">{g.group}</div>}
            {g.rows.map((r) => <Item key={r.id} r={r} />)}
          </div>
        ))}
      </nav>
    </aside>
  );
}

Object.assign(window, { OrgAdminSidebar, ORG_TEAMS });
