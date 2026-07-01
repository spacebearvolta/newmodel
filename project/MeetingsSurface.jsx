// MeetingsSurface.jsx — the Meetings home view, recreated from the production
// screenshot using Grain DS primitives. One component serves three states:
//
//   mode="solo"    — single player. No workspace machinery: no team tabs, no
//                    team-access column. Shows a >30-day locked meeting
//                    (free history limit).
//   mode="org"     — active organization. Tabs: My meetings / All meetings ‖
//                    team views. All meetings shows per-team share metadata
//                    and the sensitive-meetings affordance.
//   mode="expired" — tombstoned workspace. Same surface; meetings the user
//                    recorded or joined stay fully accessible, meetings
//                    shared by others render as locked tiles with an
//                    upgrade prompt. Free limits note on My meetings.
//
// Exports: MeetingsSurface, ExpiredBar, MS_MY_MEETING_COUNT

const { useState: useMS, useMemo: useMSMemo } = React;

/* ── Data ───────────────────────────────────────────────────────────────
   shared: null = private ("No team access") · 'all' = whole workspace ·
   [teamNames] = specific teams. mine: the current user recorded or joined. */

const MS_UP_NEXT = [
  { id: 'u1', mo: 'Jun', day: 10, title: 'Jeff <> Maya Weekly Check-in', when: 'Today · 4:30 PM', kind: 'Internal', shared: null, recorders: 2, people: 2, hash: 0, tag: 'Unknown Internal' },
  { id: 'u2', mo: 'Jun', day: 11, title: 'Design Sync', when: 'Tomorrow · 11:00 AM', kind: 'External', shared: null, recorders: 1, people: 4, hash: 0, tag: 'Unknown External' },
  { id: 'u3', mo: 'Jun', day: 12, title: 'Personalized Zapier onboarding — Jeff Whitlock and Steven Nelemans', when: 'Fri · 8:30 AM', kind: 'External', shared: null, recorders: 1, people: 2, hash: 0, tag: 'Unknown External' },
];
const MS_UP_NEXT_MORE = [
  { id: 'u4', mo: 'Jun', day: 15, title: 'Q3 pipeline review', when: 'Mon · 10:00 AM', kind: 'Internal', shared: null, recorders: 1, people: 6, hash: 0, tag: 'Project & Team Sync' },
  { id: 'u5', mo: 'Jun', day: 16, title: 'Beacon onboarding — week 2', when: 'Tue · 1:00 PM', kind: 'External', shared: null, recorders: 1, people: 3, hash: 0, tag: 'User Research' },
];

// My meetings — grouped by day. Owner is the current user throughout.
const MS_MINE_GROUPS = [
  { label: 'Today', rows: [
    { id: 'm1', title: 'Planning: "Odyssey" Platform — Plugin & Search Features', when: '2:51 PM', dur: '10m', kind: 'Internal', shared: null, recorders: 1, people: 1, hash: 0, tag: 'Project & Team Sync', thumb: 'audio', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm2', title: '30 minute meeting with Neel (Jeff Whitlock)', when: '1:34 PM', dur: '22m', kind: 'External', shared: null, recorders: 1, people: 3, hash: 0, tag: 'User Research', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm3', title: 'Acme <> Linkflow Monthly Meeting', when: '1:03 PM', dur: '28m', kind: 'External', shared: ['Executive Team'], recorders: 3, people: 13, hash: 0, tag: 'Partnerships & BD', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm4', title: 'Product <> Support Sync', when: '10:34 AM', dur: '50m', kind: 'Internal', shared: null, recorders: 2, people: 10, hash: 0, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm5', title: 'Product <> Support Sync', when: '10:34 AM', dur: '51m', kind: 'Internal', shared: null, recorders: 2, people: 10, hash: 0, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm6', title: 'Product <> Support Sync', when: '10:30 AM', dur: '54s', kind: 'Internal', shared: null, recorders: 2, people: 8, hash: 0, tag: 'Unknown Internal', thumb: 'doc', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm7', title: 'Standup', when: '9:43 AM', dur: '26m', kind: 'Internal', shared: 'all', recorders: 5, people: 18, hash: 2, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
  ]},
  { label: 'Monday, Jun 8', rows: [
    { id: 'm8', title: 'Q3 pipeline kickoff', when: '11:00 AM', dur: '47m', kind: 'Internal', shared: ['Sales'], recorders: 2, people: 7, hash: 1, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
    { id: 'm9', title: 'Customer onboarding — Beacon', when: '9:30 AM', dur: '33m', kind: 'External', shared: null, recorders: 1, people: 4, hash: 0, tag: 'User Research', mine: true, owner: 'Jeff Whitlock' },
  ]},
  { label: 'Friday, Jun 5', rows: [
    { id: 'm10', title: 'Acme all-hands', when: '4:00 PM', dur: '40m', kind: 'Internal', shared: 'all', recorders: 3, people: 26, hash: 1, tag: 'Project & Team Sync', mine: true, owner: 'Jeff Whitlock' },
  ]},
];
const MS_MINE_ALL = MS_MINE_GROUPS.flatMap((g) => g.rows);

// Single player: one meeting past the 30-day free history window.
const MS_OLDER_LOCKED = [
  { id: 'o1', title: 'Q2 planning offsite — day 1', date: 'Recorded May 8', mine: true },
];

// Org-wide shared meetings (the All meetings view). Only meetings shared to
// at least one team appear here — private meetings never do. Strictly
// chronological: the user's own meetings and teammates' meetings intersperse.
// Every `mine: true` row here also lives in MS_MINE_GROUPS — that's why it
// stays unlocked when the workspace is inactive.
const MS_ALL_SHARED = [
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

const MS_VIEWS = [
  { id: 'mine', label: 'My meetings' },
  { id: 'all', label: 'Team meetings' },
  // Right of "All meetings": saved views (personal saved filters), not teams.
  { id: 'Mike meetings', label: 'Mike meetings', dividerBefore: true },
  { id: 'Sales calls', label: 'Sales calls' },
];

// Single player sees the same core tabs — the surface itself is constant
// across states. Saved views are workspace machinery, so they only appear
// once an organization exists.
const MS_SOLO_VIEWS = MS_VIEWS.slice(0, 2);

// Saved-view contents — curated slices over meetings the user can see
// (their own, plus team-shared ones). Chronological.
const MS_BY_ID = {};
[...MS_MINE_ALL, ...MS_ALL_SHARED].forEach((m) => { if (!MS_BY_ID[m.id]) MS_BY_ID[m.id] = m; });
const MS_VIEW_ROWS = {
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

const MS_MY_MEETING_COUNT = MS_MINE_ALL.length;

/* ── Small pieces ───────────────────────────────────────────────────── */

// Where can this meeting be seen? The always-present answer to "who can see
// this?" — lock = only people it's shared with, globe = whole workspace,
// team icon = those teams.
function AccessCell({ shared, tombstoned, orgName = 'the workspace' }) {
  if (!shared) {
    return (
      <span className="ms-cell ms-cell--access">
        <Icon name="lock" /><span>No team access</span>
      </span>
    );
  }
  const isAll = shared === 'all';
  const label = isAll ? 'All teams' : shared.length === 1 ? shared[0] : `${shared[0]} + ${shared.length - 1}`;
  const icon = isAll ? 'globe' : shared[0] === 'Executive Team' ? 'trophy' : 'users';
  if (tombstoned) {
    // The share still exists, but those teams can't see it while the
    // workspace is inactive — show the property struck through, not removed.
    const list = isAll ? 'all teams' : shared.join(', ');
    return (
      <span className="ms-cell ms-cell--access is-tombstoned"
        title={`Shared with ${list} — paused while ${orgName} is inactive. Only you can see this meeting right now.`}>
        <Icon name={icon} /><span>{label}</span>
      </span>
    );
  }
  return (
    <span className="ms-cell ms-cell--access is-shared" title={isAll ? 'Shared with every team in the workspace' : `Shared with: ${shared.join(', ')}`}>
      <Icon name={icon} /><span>{label}</span>
    </span>
  );
}

function Thumb({ kind, locked }) {
  if (locked) return <div className="ms-thumb ms-thumb--locked"><Icon name="lock" /></div>;
  if (kind === 'audio') return <div className="ms-thumb ms-thumb--audio"><Icon name="audioLines" /></div>;
  if (kind === 'doc') return <div className="ms-thumb ms-thumb--doc"><Icon name="fileText" /></div>;
  return <div className="ms-thumb"><Icon name="video" /></div>;
}

function MetaCells({ m, solo, tombstoneAccess, orgName }) {
  return (
    <>
      {!solo && <AccessCell shared={m.shared} tombstoned={tombstoneAccess} orgName={orgName} />}
      <span className="ms-cell ms-cell--rec"><Icon name="video" /><span>{m.recorders} {m.recorders === 1 ? 'recorder' : 'recorders'}</span></span>
      <span className="ms-cell ms-cell--people"><Icon name="users" /><span>{m.people}</span></span>
    </>
  );
}

/* Captured meeting row.
   locked      — a teammate's meeting while the workspace is inactive: every
                 property stays visible but grayed; the action is Upgrade.
   tombstoned  — the user's own meeting whose team share is paused: only the
                 access property is struck through. */
function MeetingRowRich({ m, solo, locked, tombstoneAccess, orgName, lockReason, onUpgrade, showOwner, onShareAttempt }) {
  const cls = `ms-row ${solo ? 'ms-row--solo' : ''} ${locked ? 'is-locked' : ''}`;
  return (
    <div className={cls} title={locked ? lockReason : undefined}>
      <Thumb kind={m.thumb} locked={locked} />
      <div className="ms-row__main">
        <div className="ms-row__title">
          {m.title}
          {!locked && m.badge ? <span className="ms-badge" title="Desktop capture missed this one — the backup bot recorded it automatically."><Icon name="check" /> {m.badge}</span> : null}
        </div>
        <div className="ms-row__meta">
          <span>{m.when}</span>
          {m.dur ? <><span className="ms-dot">·</span><span>{m.dur}</span></> : null}
          <span className="ms-dot">·</span><span>{m.kind}</span>
          {showOwner && m.owner ? <><span className="ms-dot">·</span><span>Recorded by {m.owner}</span></> : null}
        </div>
      </div>
      <MetaCells m={m} solo={solo} tombstoneAccess={!locked && tombstoneAccess} orgName={orgName} />
      <span className="ms-row__action">
        {locked ? (
          <button className="ms-unlock" title="Upgrade to view" onClick={onUpgrade}>
            <Icon name="upgradeCircle" /> Upgrade
          </button>
        ) : (
          <button className="ms-row__kebab" aria-label={solo && onShareAttempt ? 'Share' : 'More'}
                  title={solo && onShareAttempt ? 'Share with a teammate' : undefined}
                  onClick={solo && onShareAttempt ? onShareAttempt : undefined}><Icon name="ellipsisV" /></button>
        )}
      </span>
    </div>
  );
}

/* Team-access popover — opened from the "No team access" property on an
   upcoming meeting. Search + per-team toggles. While the workspace is
   inactive the toggles are disabled and the footer offers Upgrade. */
const MS_POPOVER_TEAMS = [
  { name: 'Executive Team', sub: 'My team', icon: 'trophy', color: '#B45309' },
  { name: 'Acme', sub: '12 members', icon: 'globe', color: '#9747FF' },
  { name: 'Sales', sub: '2 members', icon: 'dollarSign', color: '#16A35F' },
  { name: 'Customer Success', sub: '1 member', icon: 'heart', color: '#EA580C' },
  { name: 'New Team', sub: '3 members', icon: 'circlePlay', color: '#0052B4' },
];

function AccessPopover({ expired, orgName, onUpgrade, onClose, anchorRef, onFeatureUse }) {
  const [q, setQ] = useMS('');
  const [on, setOn] = useMS({});
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDown = (e) => {
      const inPop = ref.current && ref.current.contains(e.target);
      const inAnchor = anchorRef && anchorRef.current && anchorRef.current.contains(e.target);
      if (!inPop && !inAnchor) onClose?.();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [onClose, anchorRef]);
  const teams = MS_POPOVER_TEAMS
    .map((t) => t.name === 'Acme' ? { ...t, name: orgName } : t)
    .filter((t) => !q.trim() || t.name.toLowerCase().includes(q.trim().toLowerCase()));
  const count = Object.values(on).filter(Boolean).length;
  return (
    <div className="ms-pop" ref={ref} onClick={(e) => e.stopPropagation()}>
      <label className="ms-pop__search">
        <Icon name="search" />
        <input placeholder="Search teams" value={q} autoFocus onChange={(e) => setQ(e.target.value)} />
      </label>
      <div className="ms-pop__count">{count} {count === 1 ? 'team' : 'teams'} will have access</div>
      <div className="ms-pop__list">
        {teams.map((t) => (
          <div key={t.name} className="ms-pop__row">
            <span className="ms-pop__icon" style={{ color: t.color }}><Icon name={t.icon} /></span>
            <span className="ms-pop__text">
              <span className="ms-pop__name">{t.name}</span>
              <span className="ms-pop__sub">{t.sub}</span>
            </span>
            <button
              className={`ms-switch ${on[t.name] ? 'is-on' : ''}`}
              disabled={expired}
              aria-pressed={!!on[t.name]}
              title={expired ? `Team sharing is paused while ${orgName} is inactive` : undefined}
              onClick={() => { if (expired) return; const turningOn = !on[t.name]; setOn((p) => ({ ...p, [t.name]: !p[t.name] })); if (turningOn) onFeatureUse?.('share'); }} />
          </div>
        ))}
      </div>
      {expired && (
        <div className="ms-pop__foot">
          <span>Team sharing is paused</span>
          <button className="ms-unlock" onClick={onUpgrade}><Icon name="upgradeCircle" /> Upgrade</button>
        </div>
      )}
    </div>
  );
}

/* Upcoming meeting row (date chip + join button) */
function UpNextRow({ m, solo, expired, orgName, onUpgrade, onRecordAttempt, onFeatureUse }) {
  const [accessOpen, setAccessOpen] = useMS(false);
  const anchorRef = React.useRef(null);
  return (
    <div className={`ms-row ${solo ? 'ms-row--solo' : ''}`}>
      <div className="ms-datechip">
        <span className="ms-datechip__mo">{m.mo}</span>
        <span className="ms-datechip__day">{m.day}</span>
      </div>
      <div className="ms-row__main">
        <div className="ms-row__title">{m.title}</div>
        <div className="ms-row__meta">
          <span>{m.when}</span>
          <span className="ms-dot">·</span><span>{m.kind}</span>
        </div>
      </div>
      {!solo && (
        <span className="ms-cell-anchor" ref={anchorRef}>
          <button className="ms-cell ms-cell--access ms-cell--click" onClick={() => setAccessOpen((o) => !o)} title="Choose which teams can see this meeting">
            <Icon name="lock" /><span>No team access</span>
          </button>
          {accessOpen && (
            <AccessPopover
              expired={expired}
              orgName={orgName}
              anchorRef={anchorRef}
              onFeatureUse={onFeatureUse}
              onUpgrade={() => { setAccessOpen(false); onUpgrade?.(); }}
              onClose={() => setAccessOpen(false)} />
          )}
        </span>
      )}
      <span className="ms-cell ms-cell--rec"><Icon name="video" /><span>{m.recorders} {m.recorders === 1 ? 'recorder' : 'recorders'}</span></span>
      <span className="ms-cell ms-cell--people"><Icon name="users" /><span>{m.people}</span></span>
      <span className="ms-row__action">
        <button className="ms-join" title="Join and record" onClick={solo && onRecordAttempt ? onRecordAttempt : undefined}>
          <Icon name="video" />
          <span className="ms-join__sep" />
          <Icon name="chevDown" />
        </button>
      </span>
    </div>
  );
}

/* Persistent expired-workspace bar. Dismissible — it returns next session,
   but the user can clear it for now. */
function ExpiredBar({ orgName, graceDays, onRestartTrial, onUpgrade, onTalkToSales, onDismiss }) {
  const urgent = graceDays != null && graceDays <= 7;
  return (
    <div className={`expired-bar ${urgent ? 'is-urgent' : ''}`} role="status">
      <span className="expired-bar__icon"><Icon name="circleAlert" /></span>
      <span className="expired-bar__text">
        {urgent ? (
          <><strong>{graceDays} {graceDays === 1 ? 'day' : 'days'} until {orgName}’s meeting history starts being deleted.</strong> Reactivate to keep everything your team recorded — meetings you recorded or joined stay yours.</>
        ) : (
          <><strong>{orgName}’s Business trial has ended.</strong> All organization meetings are accessible for {graceDays != null ? graceDays : 30} days — meetings you recorded or joined stay fully yours. <a className="expired-bar__link" href="#" onClick={(e) => { e.preventDefault(); onTalkToSales?.(); }}>Talk to sales</a>.</>
        )}
      </span>
      <span className="expired-bar__actions">
        <button className="expired-bar__btn expired-bar__btn--solid" onClick={onUpgrade}>Upgrade</button>
        <button className="expired-bar__btn expired-bar__btn--outline" onClick={onRestartTrial}>Talk to sales</button>
        <button className="expired-bar__close" aria-label="Dismiss" title="Dismiss" onClick={onDismiss}><Icon name="close" /></button>
      </span>
    </div>
  );
}

/* ── All meetings, before there's an organization ────────────────────
   The tab always exists; without an active workspace it's the surface
   that explains what lives behind it and offers the way in (start a
   trial, or view a pending invite). Ghost rows preview the real list. */
function SoloAllGate({ gate = {}, onCta }) {
  const title = gate.title || 'See every meeting your team shares';
  const desc  = gate.desc  || 'All meetings is your organization\u2019s shared library. When teammates share a meeting to a team, it shows up here for the whole organization to search and revisit.';
  const cta   = gate.cta   || 'Start trial';
  const note  = gate.note  !== undefined ? gate.note : 'Included in Grain Business \u00b7 free for 14 days';
  const widths = [[46, 28], [61, 34], [38, 22]];
  return (
    <div className="ms-gate" data-screen-label="All meetings — trial gate">
      <div className="ms-gate__preview" aria-hidden="true">
        {widths.map((w, i) => (
          <div key={i} className="ms-gate__row">
            <div className="ms-gate__thumb"></div>
            <div className="ms-gate__lines">
              <span style={{ width: `${w[0]}%` }}></span>
              <span style={{ width: `${w[1]}%` }}></span>
            </div>
            <span className="ms-gate__pill"></span>
            <span className="ms-gate__pill ms-gate__pill--sm"></span>
          </div>
        ))}
      </div>
      <div className="ms-gate__card">
        <span className="ms-gate__icon"><Icon name="globe" /></span>
        <div className="ms-gate__title">{title}</div>
        <div className="ms-gate__desc">{desc}</div>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onCta}>
          <span className="btn-label">{cta}</span>
        </button>
        {note && <div className="ms-gate__note">{note}</div>}
      </div>
    </div>
  );
}

/* ── Main surface ───────────────────────────────────────────────────── */

function MeetingsSurface({
  mode = 'org',            // 'solo' | 'org' | 'expired'
  orgName = 'Acme',
  hasMeetings = true,
  firstMeetingOnly = false,  // just-finished-setup: show exactly one captured meeting
  initialView = 'mine',
  trialPill = null,        // optional node next to the title (trial countdown)
  banner = null,           // optional node above the list (e.g. post-join)
  onUpgrade,
  onStartTrial,            // solo: CTA behind the All meetings gate
  gate,                    // solo: optional copy overrides for the gate
  onRecordAttempt,         // solo: free 45-min recording wall (H1)
  onLockedClick,           // solo: open locked-meeting explainer (H3)
  onShareAttempt,          // solo: share → team value modal (H5)
  myMeetingsBanner,        // node shown only on the My meetings view
  businessTrialDays,       // active org on trial: days left (drives H8 chip)
  onFeatureUse,            // active org on trial: fired when a Business feature is used (H8)
}) {
  const solo = mode === 'solo';
  const expired = mode === 'expired';
  const [view, setView] = useMS(initialView);
  const [filter, setFilter] = useMS('');
  const [showAll, setShowAll] = useMS(false);
  const [teamChipDismissed, setTeamChipDismissed] = useMS(false);

  const upNext = showAll ? [...MS_UP_NEXT, ...MS_UP_NEXT_MORE] : MS_UP_NEXT;

  const isMine = view === 'mine';
  // Single player on the All meetings tab: the surface exists, but it's
  // behind the trial — show the gate instead of a list.
  const soloGate = solo && !isMine;

  // Grouped rows: My meetings keeps its day sections; org views are a single
  // chronological list (locked + unlocked interspersed).
  const groups = useMSMemo(() => {
    const q = filter.trim().toLowerCase();
    const match = (m) => !q || m.title.toLowerCase().includes(q);
    if (soloGate) return [];
    if (isMine) {
      // The "existing personal meetings" state applies the same way before and
      // after a trial — creating an org never auto-populates meetings.
      if (firstMeetingOnly) {
        // First completed meeting state: surface exactly one captured meeting.
        const first = MS_MINE_GROUPS[0] && MS_MINE_GROUPS[0].rows.filter(match)[0];
        return first ? [{ label: MS_MINE_GROUPS[0].label, rows: [first] }] : [];
      }
      if (!hasMeetings) return [];
      return MS_MINE_GROUPS
        .map((g) => ({ label: g.label, rows: g.rows.filter(match) }))
        .filter((g) => g.rows.length > 0);
    }
    const rows = (view === 'all'
      ? MS_ALL_SHARED
      : (MS_VIEW_ROWS[view] || [])
    ).filter(match);
    return rows.length ? [{ label: null, rows }] : [];
  }, [isMine, view, filter, hasMeetings, firstMeetingOnly, soloGate]);

  const isEmpty = groups.length === 0;

  return (
    <div data-screen-label={solo ? (soloGate ? 'All meetings — single player (trial gate)' : 'Team meetings — single player') : expired ? `Meetings — ${orgName} (trial expired)` : `Meetings — ${orgName}`}>
      {/* Header */}
      <div className="ms-head">
        <div className="ms-head__title">
          <Icon name="video" />
          <span>Meetings</span>
          {trialPill && <span className="ms-head__pill">{trialPill}</span>}
        </div>
        <div className="ms-head__right">
          <label className="ms-filter">
            <input
              placeholder="Filter by title"
              value={filter}
              onChange={(e) => setFilter(e.target.value)} />
          </label>
          <button className="ms-iconbtn" title="Filter"><Icon name="funnel" /></button>
          <button className="ms-iconbtn" title="Display options"><Icon name="slidersH" /></button>
          <button className="ms-iconbtn" title="More"><Icon name="ellipsisV" /></button>
        </div>
      </div>

      {/* View tabs — every state. The tabs are constant; what changes is
          what's behind them (solo's All meetings sits behind the trial). */}
      <ViewTabs
        views={solo ? MS_SOLO_VIEWS : MS_VIEWS}
        activeId={view}
        onChange={setView}
        addDivider={solo}
        onAdd={() => {}} />

      {banner}
      {isMine && myMeetingsBanner}
      {!solo && !expired && businessTrialDays != null && view === 'all' && !teamChipDismissed && (
        <FeatureNudgeChip feature="Team meetings" daysLeft={businessTrialDays} onDismiss={() => setTeamChipDismissed(true)} />
      )}


      {/* Up next — only meaningful on your own calendar */}
      {isMine && (
        <div className="ms-upnext">
          <div className="ms-upnext__label"><Icon name="clock" /> Up next</div>
          <div className="ms-list">
            {upNext.map((m) => <UpNextRow key={m.id} m={m} solo={solo} expired={expired} orgName={orgName} onUpgrade={onUpgrade} onRecordAttempt={onRecordAttempt} onFeatureUse={onFeatureUse} />)}
          </div>
          <button className={`ms-showall ${showAll ? 'is-open' : ''}`} onClick={() => setShowAll(!showAll)}>
            <Icon name="chevDown" /> {showAll ? 'Show less' : 'Show all'}
          </button>
        </div>
      )}

      {/* List — or, single player on All meetings, the trial gate */}
      {soloGate ? (
        <SoloAllGate gate={gate} onCta={onStartTrial || onUpgrade} />
      ) : isEmpty ? (
        <div className="ms-empty">
          <div className="ms-empty__title">{isMine ? 'No meetings have been captured yet' : 'No meetings in this view'}</div>
          <div className="ms-empty__sub">{isMine
            ? 'Meetings captured by Grain that you were a part of will appear here.'
            : view === 'all'
              ? 'Meetings shared with at least one team will appear here.'
              : 'Meetings matching this view’s filters will appear here.'}</div>
        </div>
      ) : (
        groups.map((g, gi) => (
          <React.Fragment key={g.label || `g${gi}`}>
            {g.label && <div className="ms-section"><Icon name="calendar" /> {g.label}</div>}
            <div className="ms-list">
              {g.rows.map((m) => {
                const locked = expired && !m.mine;
                return (
                  <MeetingRowRich
                    key={m.id}
                    m={m}
                    solo={solo}
                    locked={locked}
                    tombstoneAccess={expired && m.mine}
                    orgName={orgName}
                    lockReason={`Shared by ${m.owner} · locked while ${orgName} is inactive`}
                    onUpgrade={onUpgrade}
                    showOwner={!isMine}
                    onShareAttempt={onShareAttempt} />
                );
              })}
            </div>
          </React.Fragment>
        ))
      )}

      {/* 30-day history limit — single player free plan */}
      {solo && isMine && hasMeetings && !filter && (
        <>
          <div className="ms-section" style={{ marginTop: 18 }}><Icon name="lock" /> Older than 30 days</div>
          <div className="ms-list">
            {MS_OLDER_LOCKED.map((m) => (
              <div key={m.id} className={`ms-row ms-row--solo is-locked${onLockedClick ? ' is-clickable' : ''}`}
                   onClick={onLockedClick ? () => onLockedClick(m) : undefined}>
                <Thumb locked />
                <div className="ms-row__main">
                  <div className="ms-row__title">{m.title}</div>
                  <div className="ms-row__lockmeta">
                    <Icon name="lock" />
                    <span>{m.date} · the free plan keeps your last 30 days</span>
                  </div>
                </div>
                <div style={{ gridColumn: '3 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="ms-unlock" onClick={(e) => { e.stopPropagation(); onUpgrade?.(); }}>
                    <Icon name="upgradeCircle" /> Upgrade to unlock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Ask anything pill */}
      <div className="ms-ask" onClick={businessTrialDays != null && onFeatureUse ? () => onFeatureUse('ai') : undefined}>
      <img src={(typeof window !== 'undefined' && window.__resources && window.__resources.grainLogo) || "assets/grain-logo.png"} alt="" />
        <span>Ask anything…</span>
        <Icon name="sparkles" />
      </div>
    </div>
  );
}

Object.assign(window, { MeetingsSurface, ExpiredBar, MS_MY_MEETING_COUNT });
