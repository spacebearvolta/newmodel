// HooksV2Live.tsx — production-wired versions of the finalized v2 hook
// designs (see redesign/HooksV2.tsx for the static comparison mockups these
// are visually identical to). These add real open/close state and callback
// wiring so they can be dropped into the rebuilt app exactly like the
// original TrialHooks.jsx baseline components were.
import { Icon } from '../primitives/Icon';
import { Modal } from '../primitives/Modal';
import grainLogo from '../../assets/grain-logo.png';

// ── H1 ────────────────────────────────────────────────────────────────────
interface RecordingLimitModalV2LiveProps {
  open: boolean;
  kind?: 'record' | 'upload';
  onClose?: () => void;
  onStartTrial?: () => void;
}
export function RecordingLimitModalV2Live({ open, kind = 'record', onClose, onStartTrial }: RecordingLimitModalV2LiveProps) {
  const isUpload = kind === 'upload';
  return (
    <Modal open={open} onClose={onClose} bare>
      <div className="modal-v2 card-v2" style={{ width: 440, position: 'relative' }}>
        <div className="h1-v2">
          <h2 className="h1-v2__title">
            {isUpload ? 'This recording is longer than 45 minutes' : 'Free recordings stop at 45 minutes'}
          </h2>
          <p className="h1-v2__sub">
            Start a Business trial to {isUpload ? 'upload and transcribe' : 'capture'} meetings of any length — every
            conversation captured end to end.
          </p>
          <ul className="h1-v2__values">
            <li><span className="mark-v2"><Icon name="infinity" size={13} /></span> No 45-minute recording cap</li>
            <li><span className="mark-v2"><Icon name="history" size={13} /></span> Unlimited meeting history</li>
            <li><span className="mark-v2"><Icon name="users" size={13} /></span> Shared meeting data the whole organization can use to stay aligned</li>
          </ul>
        </div>
        <div className="h1-v2__foot">
          <button className="btn-v2 btn-v2--primary btn-v2--full btn-v2--lg" onClick={onStartTrial}>Start free trial</button>
          <button className="h1-v2__link" onClick={onClose}>Maybe later</button>
        </div>
      </div>
    </Modal>
  );
}

// ── H2 ────────────────────────────────────────────────────────────────────
interface HistoryLockBannerV2LiveProps {
  daysLeft?: number;
  onStartTrial?: () => void;
  onDismiss?: () => void;
}
export function HistoryLockBannerV2Live({ daysLeft = 5, onStartTrial, onDismiss }: HistoryLockBannerV2LiveProps) {
  return (
    <div className="h2-v2">
      <span className="h2-v2__icon"><Icon name="history" size={16} /></span>
      <span className="h2-v2__text">
        <span className="h2-v2__title">Some of your meetings will lock in {daysLeft} day{daysLeft === 1 ? '' : 's'}</span>
        <span className="h2-v2__body">
          Try <button className="ms-history-banner__link" onClick={onStartTrial}>Grain Business</button> to keep your meeting history searchable, forever.
        </span>
      </span>
      <button className="h2-v2__close" aria-label="Dismiss" onClick={onDismiss}><Icon name="close" size={14} /></button>
    </div>
  );
}

// ── H3 ────────────────────────────────────────────────────────────────────
interface LockedMeetingModalV2LiveProps {
  meeting: { title: string; date: string } | null;
  onClose?: () => void;
  onStartTrial?: () => void;
}
export function LockedMeetingModalV2Live({ meeting, onClose, onStartTrial }: LockedMeetingModalV2LiveProps) {
  return (
    <Modal open={!!meeting} onClose={onClose} bare>
      <div className="modal-v2 card-v2" style={{ width: 440 }}>
        <div className="h3-v2">
          <h2 className="h3-v2__title">This meeting is locked</h2>
          <div className="h3-v2__row">
            <span className="h3-v2__thumb"><Icon name="lock" size={13} /></span>
            <span>
              <span className="h3-v2__name">{meeting?.title}</span>
              <span className="h3-v2__meta">{meeting?.date}</span>
            </span>
          </div>
          <p className="h3-v2__sub">Start a Business trial to unlock this meeting and keep every meeting you record, for good.</p>
        </div>
        <div className="h1-v2__foot" style={{ paddingTop: 0 }}>
          <button className="btn-v2 btn-v2--primary btn-v2--full btn-v2--lg" onClick={onStartTrial}>Start free trial to unlock</button>
          <button className="h1-v2__link" onClick={onClose}>Maybe later</button>
        </div>
      </div>
    </Modal>
  );
}

// ── H4 / H5 ───────────────────────────────────────────────────────────────
const TEAM_MODAL_COPY_V2 = {
  invite: { title: 'Work is better, together.', sub: 'Invite your whole team — everyone’s shared meetings build one searchable, AI-ready memory.', cta: 'Start free trial to invite' },
  share: { title: 'Share this meeting with your team', sub: 'Give your team the full context of every call — not just the parts they were in.', cta: 'Start free trial to share' },
};
const TEAM_PREVIEW_TITLES = [
  'Q2 planning offsite — day 1', 'Discovery call — Quest.io', 'Weekly sync — Product',
  '1:1 with Jordan', 'Customer renewal — Northwind', 'Sprint retro', 'Onboarding — new hire',
];
interface TeamValueModalV2LiveProps {
  trigger: 'invite' | 'share' | null;
  onClose?: () => void;
  onStartTrial?: () => void;
}
export function TeamValueModalV2Live({ trigger, onClose, onStartTrial }: TeamValueModalV2LiveProps) {
  const copy = trigger ? TEAM_MODAL_COPY_V2[trigger] : TEAM_MODAL_COPY_V2.invite;
  return (
    <Modal open={!!trigger} onClose={onClose} bare>
      <div className="h45-v2" style={{ width: 620 }}>
        <div className="h45-v2__inner">
          <div>
            <span className="eyebrow-v2">Grain Business · free for 14 days</span>
            <h2 className="h45-v2__title">{copy.title}</h2>
            <p className="h45-v2__sub">{copy.sub}</p>
            <ul className="h45-v2__values">
              <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="infinity" size={13} /></span> No 45-minute recording cap</li>
              <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="history" size={13} /></span> Unlimited meeting history</li>
              <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="users" size={13} /></span> A shared library your whole team can search</li>
              <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="plug" size={13} /></span> Integrations & API — HubSpot, Salesforce, Slack</li>
            </ul>
            <div className="h1-v2__foot" style={{ padding: 0, marginTop: 22 }}>
              <button className="btn-v2 btn-v2--primary btn-v2--lg btn-v2--full" onClick={onStartTrial}>{copy.cta}</button>
              <button className="h1-v2__link" onClick={onClose}>Not now</button>
            </div>
          </div>
          <div className="card-v2 h45-v2__preview" style={{ background: 'var(--bg-alt)', padding: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Icon name="users" size={13} /> Team meetings</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TEAM_PREVIEW_TITLES.map((title) => (
                <div key={title} className="card-v2" style={{ padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--green-100)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="video" size={14} />
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── H7 interstitial ───────────────────────────────────────────────────────
const H7_MEETINGS_V2 = [
  { title: 'Weekly sync — Product', minutes: 34, locksInDays: 5 },
  { title: 'Q2 planning offsite — day 1', minutes: 52, locksInDays: 12 },
  { title: 'Discovery call — Quest.io', minutes: 38, locksInDays: 12 },
  { title: '1:1 with Jordan', minutes: 22, locksInDays: 20 },
  { title: 'Customer renewal — Northwind', minutes: 30, daysOld: 32 },
  { title: 'Onboarding — new hire', minutes: 28, daysOld: 38 },
  { title: 'Sprint retro', minutes: 61, daysOld: 45 },
] as { title: string; minutes: number; locksInDays?: number; daysOld?: number }[];

interface TrialExpiredInterstitialV2LiveProps {
  open: boolean;
  orgName?: string;
  graceDays?: number;
  onUpgrade?: () => void;
  onContinueFree?: () => void;
}
export function TrialExpiredInterstitialV2Live({ open, orgName = 'Acme', graceDays = 30, onUpgrade, onContinueFree }: TrialExpiredInterstitialV2LiveProps) {
  return (
    <Modal open={open} dismissible={false} bare>
      <div className="modal-v2 card-v2 h45-v2__inner" style={{ width: 620 }}>
        <div>
          <h2 style={{ font: '700 26px/1.25 var(--font-sans)', color: 'var(--fg-1)', margin: '0 0 10px' }}>Your Grain Business trial has ended</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-4)', margin: 0 }}>
            Nothing's gone. {orgName}'s shared meetings are saved for {graceDays} days — reactivate to switch everything back on.
          </p>
          <ul className="h45-v2__values">
            <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="infinity" size={13} /></span> No 45-minute recording cap</li>
            <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="history" size={13} /></span> Unlimited meeting history</li>
            <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="users" size={13} /></span> Your team's shared meeting library, back on</li>
          </ul>
          <div className="h1-v2__foot" style={{ padding: 0, marginTop: 22 }}>
            <button className="btn-v2 btn-v2--primary btn-v2--lg btn-v2--full" onClick={onUpgrade}><Icon name="gem" size={14} /> Upgrade now</button>
            <button className="h1-v2__link" onClick={onContinueFree}>Continue with free account</button>
          </div>
        </div>
        <div className="card-v2 h45-v2__preview" style={{ background: 'var(--bg-alt)', padding: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Icon name="users" size={13} /> Team meetings</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {H7_MEETINGS_V2.map((m) => {
              const isOld = m.daysOld != null;
              const isLockingSoon = m.locksInDays != null && m.locksInDays < 7;
              const flagged = m.minutes > 45 || isLockingSoon || isOld;
              const statusText = isOld ? `${m.daysOld} days old` : `locking in ${m.locksInDays} days`;
              return (
                <div key={m.title} className="card-v2" style={{ padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--green-100)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="video" size={14} />
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</span>
                    <span style={{ display: 'block', fontSize: 11, color: flagged ? '#C2410C' : 'var(--fg-5)' }}>{m.minutes} min · {statusText}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── H7 companion sidebar card ─────────────────────────────────────────────
interface TrialEndedCardV2LiveProps {
  orgName?: string;
  graceDays?: number;
  onUpgrade?: () => void;
  onTalkToSales?: () => void;
}
export function TrialEndedCardV2Live({ orgName = 'Acme', graceDays, onUpgrade, onTalkToSales }: TrialEndedCardV2LiveProps) {
  const urgent = graceDays != null && graceDays <= 7;
  return (
    <div className="tec-v2" style={{ width: '100%' }}>
      <div className="tec-v2__title">Trial ended</div>
      <p className="tec-v2__desc">Everything stays saved. Meetings shared by teammates unlock when {orgName} is active again.</p>
      {urgent && (
        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#C2410C', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="alert" size={13} /> {graceDays} {graceDays === 1 ? 'day' : 'days'} until history is deleted
        </p>
      )}
      <button className="btn-v2 btn-v2--primary btn-v2--full" onClick={onUpgrade}><Icon name="gem" size={13} /> Upgrade</button>
      <button className="btn-v2 btn-v2--ghost btn-v2--full" style={{ marginTop: 6 }} onClick={onTalkToSales}>Talk to sales</button>
    </div>
  );
}

// ── H8 ────────────────────────────────────────────────────────────────────
const FEATURE_ICON_V2: Record<string, string> = {
  'Team meetings': 'users',
  'Sharing to a team': 'share2',
  'AI actions on shared meetings': 'sparkles',
  'Workspace integrations': 'plug',
};
interface FeatureNudgeChipV2LiveProps { feature: string; daysLeft?: number | null; onDismiss?: () => void }
export function FeatureNudgeChipV2Live({ feature, daysLeft, onDismiss }: FeatureNudgeChipV2LiveProps) {
  return (
    <div className="h8-v2">
      <span className="h8-v2__icon"><Icon name={FEATURE_ICON_V2[feature] ?? 'users'} size={14} /></span>
      <span className="h8-v2__text">
        <strong>{feature}</strong> is a Grain Business feature
        {daysLeft != null ? ` · ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your trial` : ''}
      </span>
      <button className="h8-v2__close" aria-label="Dismiss" onClick={onDismiss}><Icon name="close" size={12} /></button>
    </div>
  );
}

// ── H9 ────────────────────────────────────────────────────────────────────
interface TeammateNudgeV2LiveProps { name?: string; daysLeft?: number; onView?: () => void; onClose?: () => void }
export function TeammateNudgeV2Live({ name = 'Maya Chen', daysLeft, onView, onClose }: TeammateNudgeV2LiveProps) {
  const first = name.split(' ')[0];
  return (
    <div className="h9-v2" style={{ position: 'fixed', right: 24, bottom: 84, zIndex: 40 }}>
      <button className="h9-v2__close" aria-label="Dismiss" onClick={onClose}><Icon name="close" size={14} /></button>
      <div className="h9-v2__head">
        <span className="mark-v2" style={{ width: 46, height: 46, borderRadius: 9999, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
        </span>
        <div>
          <div className="h9-v2__eyebrow">
            <Icon name="clock" size={13} />
            {daysLeft != null ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in trial` : ''}
          </div>
          <div className="h9-v2__title">{first} just captured their first meeting</div>
        </div>
      </div>
      <p className="h9-v2__body">
        {first}'s meeting just landed in your workspace — that's shared context your whole team can search and build on.
      </p>
      <div className="h9-v2__actions">
        <button className="btn-v2 btn-v2--ghost" onClick={onClose}>Not now</button>
        <button className="btn-v2 btn-v2--dark" onClick={onView}>View meeting summary</button>
      </div>
    </div>
  );
}

// ── Trial widget (sidebar) ─────────────────────────────────────────────────
interface TrialWidgetV2LiveProps { daysLeft?: number; onUpgrade?: () => void; onOpen?: () => void }
export function TrialWidgetV2Live({ daysLeft = 14, onUpgrade, onOpen }: TrialWidgetV2LiveProps) {
  const TOTAL = 14;
  const urgent = daysLeft <= 3;
  const dayNum = TOTAL - daysLeft;
  const pct = Math.max(3, Math.min(100, (dayNum / TOTAL) * 100));
  return (
    <div className="tw-v2" style={{ width: '100%' }}>
      <button className="tw-v2__top" onClick={onOpen}>
        <span className="tw-v2__badge" style={urgent ? { background: '#FBE7DC', color: '#C1542A' } : undefined}>
          <Icon name={urgent ? 'alert' : 'clock'} size={14} />
        </span>
        <span>
          <span className="tw-v2__days">{daysLeft <= 1 ? 'Last day of trial' : `${daysLeft} days left`}</span>
          <span className="tw-v2__plan">Grain Business trial</span>
        </span>
      </button>
      <div className="tw-v2__bar"><span style={{ width: `${pct}%`, background: urgent ? '#C1542A' : undefined }} /></div>
      <div className="tw-v2__meta">Day {dayNum} of {TOTAL}</div>
      <button className="btn-v2 btn-v2--primary btn-v2--full" onClick={onUpgrade}><Icon name="gem" size={13} /> Upgrade now</button>
    </div>
  );
}

// ── Trial countdown popup ───────────────────────────────────────────────────
const TRIAL_NODES_V2 = [
  { icon: 'video', pos: 'tl' },
  { icon: 'sparkles', pos: 'tr' },
  { icon: 'users', pos: 'bl' },
  { icon: 'settings', pos: 'br' },
] as { icon: string; pos: 'tl' | 'tr' | 'bl' | 'br' }[];

interface TrialCountdownV2LiveProps {
  daysLeft: number | null;
  orgName?: string;
  onUpgrade?: () => void;
  onClose?: () => void;
}
export function TrialCountdownV2Live({ daysLeft, orgName = 'Acme', onUpgrade, onClose }: TrialCountdownV2LiveProps) {
  const TOTAL = 14;
  const urgent = (daysLeft ?? 0) <= 3;
  const dayNum = TOTAL - (daysLeft ?? 0);
  const pct = Math.max(2, Math.min(100, (dayNum / TOTAL) * 100));
  return (
    <Modal open={daysLeft != null} onClose={onClose} bare>
      <div className="tc-v2">
        <button className="trial-pop__close" aria-label="Dismiss" onClick={onClose}>
          <Icon name="close" size={16} stroke={2.25} />
        </button>
        <div className="tc-v2__hero">
          <div className="trial-pop__net">
            <svg className="trial-pop__links" aria-hidden="true">
              <line x1="50%" y1="50%" x2="13%" y2="26%" />
              <line x1="50%" y1="50%" x2="87%" y2="26%" />
              <line x1="50%" y1="50%" x2="13%" y2="74%" />
              <line x1="50%" y1="50%" x2="87%" y2="74%" />
            </svg>
            <span className="trial-pop__core">
              <img src={grainLogo} alt="Grain" onError={(e) => { (e.target as HTMLImageElement).outerHTML = '<span class="trial-pop__coreMark">G</span>'; }} />
            </span>
            {TRIAL_NODES_V2.map((n) => (
              <span key={n.pos} className={`trial-pop__node trial-pop__node--${n.pos}`}>
                <Icon name={n.icon} size={18} />
              </span>
            ))}
          </div>
        </div>
        <div className="tc-v2__body">
          <h2 className="tc-v2__days">{(daysLeft ?? 0) <= 1 ? 'Last day of your trial' : `${daysLeft} days left on trial`}</h2>
          <p className="tc-v2__sub">
            {urgent ? `Upgrade before your trial ends to keep ${orgName} and your shared meeting context.` : 'Upgrade to keep using Grain with your team.'}
          </p>
          <div className="tc-v2__bar"><span style={{ width: `${pct}%` }} /></div>
          <div className="tc-v2__meta">Day {dayNum} of {TOTAL} · {orgName} · Grain Business</div>
          <div className="tc-v2__actions">
            <button className="btn-v2 btn-v2--ghost" onClick={onClose}>Maybe later</button>
            <button className="btn-v2 btn-v2--primary btn-v2--lg" onClick={onUpgrade}><Icon name="gem" size={14} /> Upgrade now</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
