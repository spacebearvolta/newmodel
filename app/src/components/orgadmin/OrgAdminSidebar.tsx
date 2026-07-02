// OrgAdminSidebar.tsx — Sidebar for the Org admin settings area.
// Groups: Admin, Teams (fixed section), Integrations.
import { Icon } from '../primitives/Icon';

export interface OrgTeam {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  members: number;
}

// Teams live only in organization settings. Icons + colors come from the
// Grain DS team set; member counts from the Members admin.
export const ORG_TEAMS: OrgTeam[] = [
  { id: 'team-grain', label: 'Grain', icon: 'globe', iconColor: '#9747FF', members: 88 },
  { id: 'team-sales', label: 'Sales', icon: 'dollarSign', iconColor: '#16A35F', members: 3 },
  { id: 'team-cs', label: 'Customer Success', icon: 'heart', iconColor: '#EA580C', members: 2 },
  { id: 'team-exec', label: 'Executive Team', icon: 'trophy', iconColor: '#B45309', members: 3 },
  { id: 'team-new', label: 'New Team', icon: 'circlePlay', iconColor: '#0052B4', members: 3 },
];

interface Row {
  id: string;
  label: string;
  icon?: string;
  brand?: string;
  initial?: string;
  iconColor?: string;
}
interface Group { group: string; rows: Row[] }

const GROUPS: Group[] = [
  {
    group: 'Admin',
    rows: [
      { id: 'general', label: 'General', icon: 'settings' },
      { id: 'meetings', label: 'Meetings', icon: 'video' },
      { id: 'members', label: 'Members', icon: 'users' },
      { id: 'templates', label: 'Templates', icon: 'fileText' },
      { id: 'scorecards', label: 'Scorecards', icon: 'clipboardList' },
      { id: 'trackers', label: 'Trackers', icon: 'tag' },
      { id: 'billing', label: 'Billing', icon: 'creditCard' },
      { id: 'plans', label: 'Plans', icon: 'upgradeCircle' },
    ],
  },
  {
    group: 'Teams',
    rows: [
      ...ORG_TEAMS.map((t) => ({ id: t.id, label: t.label, icon: t.icon, iconColor: t.iconColor })),
      { id: 'team-create', label: 'New team', icon: 'plus' },
    ],
  },
  {
    group: 'Integrations',
    rows: [
      { id: 'mcp', label: 'MCP Clients', icon: 'squareTerminal' },
      { id: 'api', label: 'API', icon: 'codeXml' },
      { id: 'hubspot', label: 'HubSpot', brand: '#FF7A59', initial: 'H' },
      { id: 'slack', label: 'Slack', brand: '#4A154B', initial: 'S' },
      { id: 'aircall', label: 'Aircall', brand: '#00B388', initial: 'A' },
      { id: 'salesforce', label: 'Salesforce', brand: '#00A1E0', initial: 'S' },
      { id: 'zapier', label: 'Zapier', brand: '#FF4F00', initial: 'Z' },
    ],
  },
];

export function OrgAdminSidebar({ active = 'general', onNav, onBack }: { active?: string; onNav?: (id: string) => void; onBack?: () => void }) {
  return (
    <aside className="gr-sidebar">
      <div className="gr-sidebar__head">
        <a className="gr-sidebar__back" href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }}>
          <Icon name="chevLeft" size={14} /> Back to app
        </a>
      </div>
      <nav className="gr-sidebar__nav">
        {GROUPS.map((g, gi) => (
          <div key={gi} className="gr-sidebar__group">
            {g.group && <div className="gr-sidebar__groupTitle">{g.group}</div>}
            {g.rows.map((r) => (
              <a
                key={r.id}
                href={`#/${r.id}`}
                className={`gr-sidebar__item ${active === r.id ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  // "New team" is an action stub, not a prototyped route.
                  if (r.id === 'team-create') return;
                  onNav?.(r.id);
                }}
              >
                {r.brand ? (
                  <span className="oa-brand" style={{ background: r.brand }} aria-hidden="true">{r.initial}</span>
                ) : r.iconColor ? (
                  <span style={{ color: r.iconColor, display: 'inline-flex' }} aria-hidden="true"><Icon name={r.icon || 'wrench'} size={15} /></span>
                ) : (
                  <Icon name={r.icon || 'wrench'} size={15} />
                )}
                <span>{r.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
