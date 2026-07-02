// Meetings surface + creator-flow mock data — ported verbatim from
// MeetingsSurface.jsx and FlowCreator.jsx.

export interface Meeting {
  id: string;
  title: string;
  when?: string;
  date?: string;
  dur?: string;
  kind?: 'Internal' | 'External';
  shared?: null | 'all' | string[];
  recorders?: number;
  people?: number;
  hash?: number;
  tag?: string;
  thumb?: 'audio' | 'doc';
  mine?: boolean;
  owner?: string;
  badge?: string;
  mo?: string;
  day?: number;
}

export const MS_UP_NEXT: Meeting[] = [
  { id: 'u1', mo: 'Jun', day: 10, title: 'Jeff <> Maya Weekly Check-in', when: 'Today · 4:30 PM', kind: 'Internal', shared: null, recorders: 2, people: 2, hash: 0, tag: 'Unknown Internal' },
  { id: 'u2', mo: 'Jun', day: 11, title: 'Design Sync', when: 'Tomorrow · 11:00 AM', kind: 'External', shared: null, recorders: 1, people: 4, hash: 0, tag: 'Unknown External' },
  { id: 'u3', mo: 'Jun', day: 12, title: 'Personalized Zapier onboarding — Jeff Whitlock and Steven Nelemans', when: 'Fri · 8:30 AM', kind: 'External', shared: null, recorders: 1, people: 2, hash: 0, tag: 'Unknown External' },
];
export const MS_UP_NEXT_MORE: Meeting[] = [
  { id: 'u4', mo: 'Jun', day: 15, title: 'Q3 pipeline review', when: 'Mon · 10:00 AM', kind: 'Internal', shared: null, recorders: 1, people: 6, hash: 0, tag: 'Project & Team Sync' },
  { id: 'u5', mo: 'Jun', day: 16, title: 'Beacon onboarding — week 2', when: 'Tue · 1:00 PM', kind: 'External', shared: null, recorders: 1, people: 3, hash: 0, tag: 'User Research' },
];

export interface MeetingGroup {
  label: string | null;
  rows: Meeting[];
}

export const MS_MINE_GROUPS: MeetingGroup[] = [
  { label: 'Today', rows: [
    { id: 'm1', title: 'Planning: "Odyssey" Platform — Plugin & Search Features', when: '2:51 PM', dur: '10m', kind: 'Internal', shared: null, recorders: 1, people: 1, hash: 0, tag: 'Project & Team Sync', thumb: 'audio', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm2', title: '30 minute meeting with Neel (Jeff Whitlock)', when: '1:34 PM', dur: '22m', kind: 'External', shared: null, recorders: 1, people: 3, hash: 0, tag: 'User Research', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm3', title: 'Acme <> Linkflow Monthly Meeting', when: '1:03 PM', dur: '28m', kind: 'External', shared: ['Executive Team'], recorders: 3, people: 13, hash: 0, tag: 'Partnerships & BD', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm4', title: 'Product <> Support Sync', when: '10:34 AM', dur: '50m', kind: 'Internal', shared: null, recorders: 2, people: 10, hash: 0, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm5', title: 'Product <> Support Sync', when: '10:34 AM', dur: '51m', kind: 'Internal', shared: null, recorders: 2, people: 10, hash: 0, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm6', title: 'Product <> Support Sync', when: '10:30 AM', dur: '54s', kind: 'Internal', shared: null, recorders: 2, people: 8, hash: 0, tag: 'Unknown Internal', thumb: 'doc', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm7', title: 'Standup', when: '9:43 AM', dur: '26m', kind: 'Internal', shared: 'all', recorders: 5, people: 18, hash: 2, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
  ] },
  { label: 'Monday, Jun 8', rows: [
    { id: 'm8', title: 'Q3 pipeline kickoff', when: '11:00 AM', dur: '47m', kind: 'Internal', shared: ['Sales'], recorders: 2, people: 7, hash: 1, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm9', title: 'Customer onboarding — Beacon', when: '9:30 AM', dur: '33m', kind: 'External', shared: null, recorders: 1, people: 4, hash: 0, tag: 'User Research', mine: true, owner: 'Jeff Whitlock' },
  ] },
  { label: 'Friday, Jun 5', rows: [
    { id: 'm10', title: 'Acme all-hands', when: '4:00 PM', dur: '40m', kind: 'Internal', shared: 'all', recorders: 3, people: 26, hash: 1, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
  ] },
];
export const MS_MINE_ALL: Meeting[] = MS_MINE_GROUPS.flatMap((g) => g.rows);

export const MS_OLDER_LOCKED: Meeting[] = [
  { id: 'o1', title: 'Q2 planning offsite — day 1', date: 'Recorded May 8', mine: true },
];

export const MS_ALL_SHARED: Meeting[] = [
  { id: 'a2', title: 'Acme <> Linkflow Monthly Meeting', when: 'Today · 1:03 PM', dur: '28m', kind: 'External', shared: ['Executive Team'], recorders: 3, people: 13, hash: 0, tag: 'Partnerships & BD', mine: true, owner: 'Jeff Whitlock' },
  { id: 'a1', title: 'Standup', when: 'Today · 9:43 AM', dur: '26m', kind: 'Internal', shared: 'all', recorders: 5, people: 18, hash: 2, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
  { id: 'a3', title: 'Northwind renewal — exec sync', when: 'Yesterday · 3:00 PM', dur: '42m', kind: 'External', shared: ['Executive Team'], recorders: 1, people: 5, hash: 1, tag: 'Partnerships & BD', mine: false, owner: 'Maya Chen' },
  { id: 'a4', title: 'Customer interview — Beacon', when: 'Yesterday · 11:15 AM', dur: '47m', kind: 'External', shared: ['Sales', 'Customer Success', 'Product'], recorders: 1, people: 3, hash: 3, tag: 'User Research', mine: false, owner: 'Nina Park' },
  { id: 'a9', title: 'Q3 pipeline kickoff', when: 'Jun 8 · 11:00 AM', dur: '47m', kind: 'Internal', shared: ['Sales'], recorders: 2, people: 7, hash: 1, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
  { id: 'a5', title: 'Engineering all-hands', when: 'Jun 8 · 9:00 AM', dur: '35m', kind: 'Internal', shared: 'all', recorders: 2, people: 22, hash: 0, tag: 'Project & Team Sync', mine: false, owner: 'Priya Sundaram' },
  { id: 'a6', title: 'Pricing & packaging workshop', when: 'Jun 6 · 2:00 PM', dur: '61m', kind: 'Internal', shared: 'all', recorders: 1, people: 8, hash: 4, tag: 'Project & Team Sync', mine: false, owner: 'Jordan Lee' },
  { id: 'a10', title: 'Acme all-hands', when: 'Jun 5 · 4:00 PM', dur: '40m', kind: 'Internal', shared: 'all', recorders: 3, people: 26, hash: 1, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
  { id: 'a7', title: 'Support escalation review', when: 'Jun 5 · 10:30 AM', dur: '29m', kind: 'Internal', shared: ['Customer Success'], recorders: 1, people: 4, hash: 0, tag: 'Unknown Internal', mine: false, owner: 'Sam Okafor' },
  { id: 'a8', title: 'QBR — Northwind', when: 'Jun 4 · 1:00 PM', dur: '52m', kind: 'External', shared: ['Customer Success', 'Sales'], recorders: 1, people: 6, hash: 2, tag: 'Partnerships & BD', mine: false, owner: 'Nina Park' },
];

export interface ViewDef { id: string; label: string; dividerBefore?: boolean }

export const MS_VIEWS: ViewDef[] = [
  { id: 'mine', label: 'My meetings' },
  { id: 'all', label: 'Team meetings' },
  { id: 'Mike meetings', label: 'Mike meetings', dividerBefore: true },
  { id: 'Sales calls', label: 'Sales calls' },
];
export const MS_SOLO_VIEWS: ViewDef[] = MS_VIEWS.slice(0, 2);

const MS_BY_ID: Record<string, Meeting> = {};
[...MS_MINE_ALL, ...MS_ALL_SHARED].forEach((m) => { if (!MS_BY_ID[m.id]) MS_BY_ID[m.id] = m; });
export const MS_VIEW_ROWS: Record<string, Meeting[]> = {
  'Mike meetings': [
    { ...MS_BY_ID.m4, when: 'Today · 10:34 AM' },
    { ...MS_BY_ID.m5, when: 'Today · 10:34 AM' },
    { ...MS_BY_ID.m6, when: 'Today · 10:30 AM' },
  ],
  'Sales calls': [
    MS_BY_ID.a2,
    MS_BY_ID.a3,
    MS_BY_ID.a4,
    { ...MS_BY_ID.m9, when: 'Jun 8 · 9:30 AM' },
    MS_BY_ID.a8,
  ],
};

export const MS_MY_MEETING_COUNT = MS_MINE_ALL.length;

// ── Org views (Sidebar / OrgShell) ──────────────────────────────────────
export const ORG_VIEWS: ViewDef[] = [
  { id: 'mine', label: 'My meetings' },
  { id: 'all', label: 'Team meetings' },
  { id: 'exec', label: 'Executive Team', dividerBefore: true },
  { id: 'newteam', label: 'New Team' },
  { id: 'grain', label: 'Grain' },
  { id: 'cs', label: 'Customer Success' },
  { id: 'sales', label: 'Sales' },
];

// ── Creator-flow data ────────────────────────────────────────────────────
export const USER = {
  name: 'Jeff Whitlock',
  email: 'jeff@acme.com',
  domain: 'acme.com',
};

export interface Peer { name: string; email: string; onGrain: boolean; lastSeen?: string; sharedMeetings?: number }

export const DOMAIN_PEERS: Peer[] = [
  { name: 'Maya Chen', email: 'maya@acme.com', onGrain: true, lastSeen: 'Active today' },
  { name: 'Devon Rao', email: 'devon@acme.com', onGrain: true, lastSeen: 'Active 2 days ago' },
  { name: 'Priya Sundaram', email: 'priya@acme.com', onGrain: true, lastSeen: 'Active 3 weeks ago' },
  { name: 'Sam Okafor', email: 'sam@acme.com', onGrain: false, sharedMeetings: 6 },
  { name: 'Alex Beckett', email: 'alex@acme.com', onGrain: false, sharedMeetings: 2 },
];

export const EXISTING_PAID_ORG = {
  name: 'Acme', plan: 'Business', members: 24, admin: 'Priya Sundaram',
};

export const PERSONAL_MEETINGS: Meeting[] = [
  { id: 'm1', title: 'Weekly 1:1 — Maya Chen', people: 2, dur: '31 min', date: 'May 28' } as Meeting,
  { id: 'm2', title: 'Acme × Northwind — Discovery', people: 5, dur: '48 min', date: 'May 27' } as Meeting,
  { id: 'm3', title: 'Product roadmap sync', people: 7, dur: '52 min', date: 'May 23' } as Meeting,
  { id: 'm4', title: 'Beacon onboarding kickoff', people: 4, dur: '39 min', date: 'May 21' } as Meeting,
  { id: 'm5', title: 'Design review — Q3 dashboard', people: 6, dur: '44 min', date: 'May 19' } as Meeting,
  { id: 'm6', title: 'Sales pipeline review', people: 5, dur: '36 min', date: 'May 16' } as Meeting,
];

export function orgNameFromDomain(domain: string): string {
  const base = (domain || '').split('.')[0] || '';
  return base.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}
