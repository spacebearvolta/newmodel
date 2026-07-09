import { useMemo, useRef, useState } from 'react';
import { Icon } from '../primitives/Icon';
import { ViewTabs } from '../shell/ViewTabs';
import { FeatureNudgeChipV2Live } from '../hooksV2/HooksV2Live';
import grainLogo from '../../assets/grain-logo.png';
import {
  MS_UP_NEXT, MS_UP_NEXT_MORE, MS_MINE_GROUPS, MS_OLDER_LOCKED, MS_ALL_SHARED,
  MS_VIEWS, MS_SOLO_VIEWS, MS_VIEW_ROWS,
} from '../../data/meetings';
import type { Meeting, ViewDef } from '../../data/meetings';

function AccessCell({ shared, tombstoned, orgName = 'the workspace' }: { shared?: Meeting['shared']; tombstoned?: boolean; orgName?: string }) {
  if (!shared) {
    return (
      <span className="ms-cell ms-cell--access">
        <Icon name="lock" /><span>No team access</span>
      </span>
    );
  }
  const isAll = shared === 'all';
  const list = isAll ? [] : shared;
  const label = isAll ? 'All teams' : list.length === 1 ? list[0] : `${list[0]} + ${list.length - 1}`;
  const icon = isAll ? 'globe' : list[0] === 'Executive Team' ? 'trophy' : 'users';
  if (tombstoned) {
    const shareList = isAll ? 'all teams' : list.join(', ');
    return (
      <span className="ms-cell ms-cell--access is-tombstoned" title={`Shared with ${shareList}, paused while ${orgName} is inactive. Only you can see this meeting right now.`}>
        <Icon name={icon} /><span>{label}</span>
      </span>
    );
  }
  return (
    <span className="ms-cell ms-cell--access is-shared" title={isAll ? 'Shared with every team in the workspace' : `Shared with: ${list.join(', ')}`}>
      <Icon name={icon} /><span>{label}</span>
    </span>
  );
}

function Thumb({ kind, locked }: { kind?: Meeting['thumb']; locked?: boolean }) {
  if (locked) return <div className="ms-thumb ms-thumb--locked"><Icon name="lock" /></div>;
  if (kind === 'audio') return <div className="ms-thumb ms-thumb--audio"><Icon name="audioLines" /></div>;
  if (kind === 'doc') return <div className="ms-thumb ms-thumb--doc"><Icon name="fileText" /></div>;
  return <div className="ms-thumb"><Icon name="video" /></div>;
}

function MetaCells({ m, solo, tombstoneAccess, orgName }: { m: Meeting; solo?: boolean; tombstoneAccess?: boolean; orgName?: string }) {
  return (
    <>
      {!solo && <AccessCell shared={m.shared} tombstoned={tombstoneAccess} orgName={orgName} />}
      <span className="ms-cell ms-cell--rec"><Icon name="video" /><span>{m.recorders} {m.recorders === 1 ? 'recorder' : 'recorders'}</span></span>
      <span className="ms-cell ms-cell--people"><Icon name="users" /><span>{m.people}</span></span>
    </>
  );
}

function MeetingRowRich({ m, solo, locked, tombstoneAccess, orgName, lockReason, onUpgrade, showOwner, onShareAttempt }: {
  m: Meeting; solo?: boolean; locked?: boolean; tombstoneAccess?: boolean; orgName?: string; lockReason?: string;
  onUpgrade?: () => void; showOwner?: boolean; onShareAttempt?: () => void;
}) {
  const cls = `ms-row ${solo ? 'ms-row--solo' : ''} ${locked ? 'is-locked' : ''}`;
  return (
    <div className={cls} title={locked ? lockReason : undefined}>
      <Thumb kind={m.thumb} locked={locked} />
      <div className="ms-row__main">
        <div className="ms-row__title">
          {m.title}
          {!locked && m.badge ? <span className="ms-badge" title="Desktop capture missed this one, so the backup bot recorded it automatically."><Icon name="check" /> {m.badge}</span> : null}
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

const MS_POPOVER_TEAMS = [
  { name: 'Executive Team', sub: 'My team', icon: 'trophy', color: '#B45309' },
  { name: 'Acme', sub: '12 members', icon: 'globe', color: '#9747FF' },
  { name: 'Sales', sub: '2 members', icon: 'dollarSign', color: '#16A35F' },
  { name: 'Customer Success', sub: '1 member', icon: 'heart', color: '#EA580C' },
  { name: 'New Team', sub: '3 members', icon: 'circlePlay', color: '#0052B4' },
];

function AccessPopover({ expired, orgName, onUpgrade, onClose, anchorRef, onFeatureUse }: {
  expired?: boolean; orgName?: string; onUpgrade?: () => void; onClose?: () => void;
  anchorRef: React.RefObject<HTMLElement | null>; onFeatureUse?: (f: string) => void;
}) {
  const [q, setQ] = useState('');
  const [on, setOn] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);
  useState(() => {
    const onDown = (e: MouseEvent) => {
      const inPop = ref.current && ref.current.contains(e.target as Node);
      const inAnchor = anchorRef.current && anchorRef.current.contains(e.target as Node);
      if (!inPop && !inAnchor) onClose?.();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  });
  const teams = MS_POPOVER_TEAMS
    .map((t) => (t.name === 'Acme' ? { ...t, name: orgName || t.name } : t))
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
              onClick={() => {
                if (expired) return;
                const turningOn = !on[t.name];
                setOn((p) => ({ ...p, [t.name]: !p[t.name] }));
                if (turningOn) onFeatureUse?.('share');
              }}
            />
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

function UpNextRow({ m, solo, expired, orgName, onUpgrade, onRecordAttempt, onFeatureUse }: {
  m: Meeting; solo?: boolean; expired?: boolean; orgName?: string; onUpgrade?: () => void;
  onRecordAttempt?: () => void; onFeatureUse?: (f: string) => void;
}) {
  const [accessOpen, setAccessOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
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
              onClose={() => setAccessOpen(false)}
            />
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

export function ExpiredBar({ orgName, graceDays, onRestartTrial, onUpgrade, onTalkToSales, onDismiss }: {
  orgName?: string; graceDays?: number | null; onRestartTrial?: () => void; onUpgrade?: () => void;
  onTalkToSales?: () => void; onDismiss?: () => void;
}) {
  const urgent = graceDays != null && graceDays <= 7;
  return (
    <div className={`expired-bar ${urgent ? 'is-urgent' : ''}`} role="status">
      <span className="expired-bar__icon"><Icon name="circleAlert" /></span>
      <span className="expired-bar__text">
        {urgent ? (
          <><strong>{graceDays} {graceDays === 1 ? 'day' : 'days'} until {orgName}'s meeting history starts being deleted.</strong> Reactivate to keep everything your team recorded; meetings you recorded or joined stay yours.</>
        ) : (
          <><strong>{orgName}'s Business trial has ended.</strong> All organization meetings are accessible for {graceDays != null ? graceDays : 30} days; meetings you recorded or joined stay fully yours. <a className="expired-bar__link" href="#" onClick={(e) => { e.preventDefault(); onTalkToSales?.(); }}>Talk to sales</a>.</>
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

function SoloAllGate({ gate, onCta }: { gate?: { title?: string; desc?: string; cta?: string; note?: string | null }; onCta?: () => void }) {
  const title = gate?.title || 'See every meeting your team shares';
  const desc = gate?.desc || "All meetings is your organization’s shared library. When teammates share a meeting to a team, it shows up here for the whole organization to search and revisit.";
  const cta = gate?.cta || 'Start trial';
  const note = gate?.note !== undefined ? gate?.note : 'Included in Grain Business · free for 14 days';
  const widths = [[46, 28], [61, 34], [38, 22]];
  return (
    <div className="ms-gate">
      <div className="ms-gate__preview" aria-hidden="true">
        {widths.map((w, i) => (
          <div key={i} className="ms-gate__row">
            <div className="ms-gate__thumb" />
            <div className="ms-gate__lines">
              <span style={{ width: `${w[0]}%` }} />
              <span style={{ width: `${w[1]}%` }} />
            </div>
            <span className="ms-gate__pill" />
            <span className="ms-gate__pill ms-gate__pill--sm" />
          </div>
        ))}
      </div>
      <div className="ms-gate__card">
        <span className="ms-gate__icon"><Icon name="users" /></span>
        <div className="ms-gate__title">{title}</div>
        <div className="ms-gate__desc">{desc}</div>
        <button className="btn-v2 btn-v2--dark btn-v2--lg" onClick={onCta}><Icon name="users" size={15} /> {cta}</button>
        {note && <div className="ms-gate__note">{note}</div>}
      </div>
    </div>
  );
}

export interface MeetingsSurfaceProps {
  mode?: 'solo' | 'org' | 'expired';
  orgName?: string;
  hasMeetings?: boolean;
  firstMeetingOnly?: boolean;
  initialView?: string;
  trialPill?: React.ReactNode;
  banner?: React.ReactNode;
  onUpgrade?: () => void;
  onStartTrial?: () => void;
  gate?: { title?: string; desc?: string; cta?: string; note?: string | null };
  onRecordAttempt?: () => void;
  onLockedClick?: (m: Meeting) => void;
  onShareAttempt?: () => void;
  myMeetingsBanner?: React.ReactNode;
  businessTrialDays?: number | null;
  nudgeFeature?: string | null;
  onFeatureUse?: (f: string) => void;
}

export function MeetingsSurface({
  mode = 'org', orgName = 'Acme', hasMeetings = true, firstMeetingOnly = false, initialView = 'mine',
  trialPill = null, banner = null, onUpgrade, onStartTrial, gate, onRecordAttempt, onLockedClick,
  onShareAttempt, myMeetingsBanner, businessTrialDays, nudgeFeature, onFeatureUse,
}: MeetingsSurfaceProps) {
  const solo = mode === 'solo';
  const expired = mode === 'expired';
  const [view, setView] = useState(initialView);
  const [filter, setFilter] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [teamChipDismissed, setTeamChipDismissed] = useState(false);

  const upNext = showAll ? [...MS_UP_NEXT, ...MS_UP_NEXT_MORE] : MS_UP_NEXT;
  const isMine = view === 'mine';
  const soloGate = solo && !isMine;

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const match = (m: Meeting) => !q || m.title.toLowerCase().includes(q);
    if (soloGate) return [];
    if (isMine) {
      if (firstMeetingOnly) {
        const first = MS_MINE_GROUPS[0]?.rows.filter(match)[0];
        return first ? [{ label: MS_MINE_GROUPS[0].label, rows: [first] }] : [];
      }
      if (!hasMeetings) return [];
      return MS_MINE_GROUPS
        .map((g) => ({ label: g.label, rows: g.rows.filter(match) }))
        .filter((g) => g.rows.length > 0);
    }
    const rows = (view === 'all' ? MS_ALL_SHARED : (MS_VIEW_ROWS[view] || [])).filter(match);
    return rows.length ? [{ label: null, rows }] : [];
  }, [isMine, view, filter, hasMeetings, firstMeetingOnly, soloGate]);

  const isEmpty = groups.length === 0;
  const views: ViewDef[] = solo ? MS_SOLO_VIEWS : MS_VIEWS;

  return (
    <div>
      <div className="ms-head">
        <div className="ms-head__title">
          <Icon name="video" />
          <span>Meetings</span>
          {trialPill && <span className="ms-head__pill">{trialPill}</span>}
        </div>
        <div className="ms-head__right">
          <label className="ms-filter">
            <input placeholder="Filter by title" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </label>
          <button className="ms-iconbtn" title="Filter"><Icon name="funnel" /></button>
          <button className="ms-iconbtn" title="Display options"><Icon name="slidersH" /></button>
          <button className="ms-iconbtn" title="More"><Icon name="ellipsisV" /></button>
        </div>
      </div>

      <ViewTabs views={views} activeId={view} onChange={setView} addDivider={solo} onAdd={() => {}} />

      {banner}
      {isMine && myMeetingsBanner}
      {!solo && !expired && businessTrialDays != null && view === 'all' && !teamChipDismissed && (
        <FeatureNudgeChipV2Live feature={nudgeFeature || 'Team meetings'} daysLeft={businessTrialDays} onDismiss={() => setTeamChipDismissed(true)} />
      )}

      {isMine && (
        <div className="ms-upnext">
          <div className="ms-upnext__label"><Icon name="clock" /> Up next</div>
          <div className="ms-list">
            {upNext.map((m) => (
              <UpNextRow key={m.id} m={m} solo={solo} expired={expired} orgName={orgName} onUpgrade={onUpgrade} onRecordAttempt={onRecordAttempt} onFeatureUse={onFeatureUse} />
            ))}
          </div>
          <button className={`ms-showall ${showAll ? 'is-open' : ''}`} onClick={() => setShowAll(!showAll)}>
            <Icon name="chevDown" /> {showAll ? 'Show less' : 'Show all'}
          </button>
        </div>
      )}

      {soloGate ? (
        <SoloAllGate gate={gate} onCta={onStartTrial || onUpgrade} />
      ) : isEmpty ? (
        <div className="ms-empty">
          <div className="ms-empty__title">{isMine ? 'No meetings have been captured yet' : 'No meetings in this view'}</div>
          <div className="ms-empty__sub">
            {isMine ? 'Meetings captured by Grain that you were a part of will appear here.'
              : view === 'all' ? 'Meetings shared with at least one team will appear here.'
              : "Meetings matching this view’s filters will appear here."}
          </div>
        </div>
      ) : (
        groups.map((g, gi) => (
          <div key={g.label || `g${gi}`}>
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
                    onShareAttempt={onShareAttempt}
                  />
                );
              })}
            </div>
          </div>
        ))
      )}

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
                  <div className="ms-row__meta">
                    <span>{m.when}</span>
                    {m.dur ? <><span className="ms-dot">·</span><span>{m.dur}</span></> : null}
                    <span className="ms-dot">·</span><span>{m.kind}</span>
                  </div>
                </div>
                <MetaCells m={m} solo />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="ms-ask" onClick={businessTrialDays != null && onFeatureUse ? () => onFeatureUse('ai') : undefined}>
        <img src={grainLogo} alt="" />
        <span>Ask anything…</span>
        <Icon name="sparkles" />
      </div>
    </div>
  );
}
