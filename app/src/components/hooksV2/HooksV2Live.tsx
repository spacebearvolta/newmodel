// HooksV2Live.tsx — the redesigned trial/upsell hook components. Used both
// by the live app (Meetings, sidebar, Integrations) and the Hook Gallery
// dev-review tool at /hook-gallery, so there is exactly one version of each
// hook's design anywhere in the app.
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
            Start a Business trial to {isUpload ? 'upload and transcribe' : 'capture'} meetings of any length. Every
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
  invite: { title: 'Work is better, together.', sub: 'Invite your whole team: everyone’s shared meetings build one searchable, AI-ready memory.', verb: 'invite' },
  share: { title: 'Share this meeting with your team', sub: 'Give your team the full context of every call, not just the parts they were in.', verb: 'share' },
};
const TEAM_PREVIEW_TITLES = [
  'Q2 planning offsite — day 1', 'Discovery call — Quest.io', 'Weekly sync — Product',
  '1:1 with Jordan', 'Customer renewal — Northwind', 'Sprint retro', 'Onboarding — new hire',
];
interface TeamValueModalV2LiveProps {
  trigger: 'invite' | 'share' | null;
  // State-driven CTA: a free user (no trial yet) starts a trial; a user whose
  // trial has ended upgrades. (Business members who've joined an org aren't
  // gated at all, so this modal simply isn't shown for them.)
  state?: 'free' | 'trial-over';
  onClose?: () => void;
  onStartTrial?: () => void;
}
export function TeamValueModalV2Live({ trigger, state = 'free', onClose, onStartTrial }: TeamValueModalV2LiveProps) {
  const copy = trigger ? TEAM_MODAL_COPY_V2[trigger] : TEAM_MODAL_COPY_V2.invite;
  const cta = state === 'trial-over' ? `Upgrade to ${copy.verb}` : `Start free trial to ${copy.verb}`;
  return (
    <Modal open={!!trigger} onClose={onClose} bare>
      <div className="h45-v2" style={{ width: 620 }}>
        <div className="h45-v2__inner">
          <div>
            <h2 className="h45-v2__title">{copy.title}</h2>
            <p className="h45-v2__sub">{copy.sub}</p>
            <ul className="h45-v2__values">
              <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="infinity" size={13} /></span> No 45-minute recording cap</li>
              <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="history" size={13} /></span> Unlimited meeting history</li>
              <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="users" size={13} /></span> A shared library your whole team can search</li>
              <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="plug" size={13} /></span> Integrations & API: HubSpot, Salesforce, Slack</li>
            </ul>
            <div className="h1-v2__foot" style={{ padding: 0, marginTop: 22 }}>
              <button className="btn-v2 btn-v2--primary btn-v2--lg btn-v2--full" onClick={onStartTrial}>{cta}</button>
              <button className="h1-v2__link" onClick={onClose}>Not now</button>
            </div>
          </div>
          <div className="card-v2 h45-v2__preview" style={{ background: 'var(--bg-alt)', padding: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Icon name="users" size={13} /> Team meetings</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TEAM_PREVIEW_TITLES.map((title) => (
                <div key={title} className="card-v2" style={{ padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--fg-4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

// ── H6 — Feature / integration upgrade gate ─────────────────────────────────
// Generalized "Upgrade your plan to access/connect X" empty-state gate. One
// shared design covers every locked-feature and locked-integration surface
// (Trackers, Coaching, Teams, Upload, Slack, HubSpot, Salesforce, API, …) plus
// the Hook Gallery, so they never drift. `eyebrow` sits above the title; pass
// `brand`/`initial` for an integration glyph or `icon` for a green feature mark
// (both optional — the deck's gates are glyph-less by default).
interface UpgradeGateCardV2LiveProps {
  title: string;
  desc: string;
  eyebrow?: string;
  icon?: string;
  brand?: string;
  initial?: string;
  cta?: string;
  note?: string | null;
  onLearnMore?: () => void;
  onUpgrade?: () => void;
}
export function UpgradeGateCardV2Live({
  title, desc, eyebrow, icon, brand, initial,
  cta = 'Start trial', note = 'Included in Grain Business · free for 14 days',
  onLearnMore, onUpgrade,
}: UpgradeGateCardV2LiveProps) {
  return (
    <div className="gate-v2">
      {(brand || icon) && (
        <span className="gate-v2__glyph">
          {brand ? (
            <span className="mark-v2" style={{ width: 44, height: 44, background: brand, color: '#fff', fontWeight: 700, fontSize: 18 }}>{initial}</span>
          ) : (
            <span className="mark-v2" style={{ width: 44, height: 44 }}><Icon name={icon!} size={20} /></span>
          )}
        </span>
      )}
      {eyebrow && <div className="gate-v2__eyebrow">{eyebrow}</div>}
      <h2 className="gate-v2__title">{title}</h2>
      <p className="gate-v2__desc">{desc}</p>
      <div className="gate-v2__actions">
        <button className="btn-v2 btn-v2--primary btn-v2--lg btn-v2--full" onClick={onUpgrade}>{cta}</button>
        {note && <div className="gate-v2__note">{note}</div>}
        <button className="gate-v2__link" onClick={onLearnMore}><Icon name="ext" size={13} /> Learn more</button>
      </div>
    </div>
  );
}

// ── H8b (deck #8) — Plans / pricing overlay modal ───────────────────────────
// Full three-plan comparison shown from any "see plans" / "upgrade your plan"
// entry point. Business is the highlighted (Popular) plan; per the green
// convention its CTA is the single primary, Starter is secondary, Free is the
// disabled current-plan state.
interface PlanDef {
  id: 'free' | 'starter' | 'business';
  name: string;
  tagline: string;
  price: string;
  priceUnit?: string;
  priceAlt?: string;
  popular?: boolean;
  moreLabel?: string;
  features: string[];
}
const PLANS_V2: PlanDef[] = [
  {
    id: 'free', name: 'Free', tagline: 'Quick and easy way to use Grain',
    price: '$0', priceAlt: 'Free forever',
    features: [
      'Unlimited meetings, 45-min limit', 'AI notes and action items', 'Basic MCP access',
      '30-day meeting history', 'AI Notepad with live notes, transcript, and clip creation',
      'Collaborative workspace', 'Desktop Capture', 'Unlimited notetaker seats',
    ],
  },
  {
    id: 'starter', name: 'Starter', tagline: 'For product, design, and research',
    price: '$15', priceUnit: 'per seat/month\nbilled annually', priceAlt: '$19 billed monthly',
    moreLabel: 'Everything in Free +',
    features: [
      'Unlimited meeting duration', 'Unlimited meeting history', 'Advanced AI notes',
      'Custom AI prompts', 'Admin controls', '1 team', 'Slack integration',
      'Productboard integration', 'Personal Zapier integration', 'Personal API',
      'Import audio & video files',
    ],
  },
  {
    id: 'business', name: 'Business', tagline: 'For sales and customer success',
    price: '$29', priceUnit: 'per seat/month\nbilled annually', priceAlt: '$39 billed monthly',
    popular: true, moreLabel: 'Everything in Starter +',
    features: [
      'HubSpot integration', 'Salesforce integration', 'Workspace Zapier integration',
      'Unlimited teams', 'Custom AI follow-up email', 'AI coaching', 'Trackers',
      'Team interaction metrics', 'Unlimited uploads', 'Workspace API', 'Advanced MCP access',
    ],
  },
];
interface PlansModalV2LiveProps {
  open: boolean;
  currentPlan?: 'free' | 'starter' | 'business';
  onClose?: () => void;
  onUpgrade?: (plan: 'starter' | 'business') => void;
  onBookDemo?: () => void;
}
export function PlansModalV2Live({ open, currentPlan = 'free', onClose, onUpgrade, onBookDemo }: PlansModalV2LiveProps) {
  return (
    <Modal open={open} onClose={onClose} bare>
      <div className="plans-v2">
        <button className="plans-v2__close" aria-label="Close" onClick={onClose}><Icon name="close" size={18} /></button>
        <div className="plans-v2__head"><span className="plans-v2__headIcon"><Icon name="upgradeCircle" size={20} /></span> Upgrade your plan</div>
        <div className="plans-v2__grid">
          {PLANS_V2.map((p) => {
            const isCurrent = p.id === currentPlan;
            return (
              <div key={p.id} className={`plans-v2__col${p.popular ? ' plans-v2__col--popular' : ''}`}>
                {p.popular && <span className="plans-v2__badge">Popular</span>}
                <div className="plans-v2__name">{p.name}</div>
                <div className="plans-v2__tag">{p.tagline}</div>
                <div className="plans-v2__price">
                  <span className="plans-v2__priceNum">{p.price}</span>
                  {p.priceUnit && <span className="plans-v2__priceUnit">{p.priceUnit}</span>}
                </div>
                {p.priceAlt && <div className="plans-v2__priceAlt">{p.priceAlt}</div>}
                <div className="plans-v2__cta">
                  {isCurrent ? (
                    <button className="btn-v2 btn-v2--secondary btn-v2--full" disabled>Current plan</button>
                  ) : (
                    <button
                      className={`btn-v2 btn-v2--full ${p.popular ? 'btn-v2--primary' : 'btn-v2--secondary'}`}
                      onClick={() => onUpgrade?.(p.id as 'starter' | 'business')}
                    >Upgrade</button>
                  )}
                </div>
                {p.moreLabel && <div className="plans-v2__more">{p.moreLabel}</div>}
                <ul className="plans-v2__feats">
                  {p.features.map((f) => (
                    <li key={f}><Icon name="check" size={14} /> {f}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="plans-v2__foot">Enterprise customer? <button onClick={onBookDemo}>Book a demo</button></div>
      </div>
    </Modal>
  );
}

// ── H7 interstitial (deck #1) ───────────────────────────────────────────────
// Shown once on the first login after the Business trial ends. Deck design:
// single-column card, value checklist in a tinted panel, "Remain on Free"
// (secondary) + "Upgrade" (green primary). orgName/graceDays are accepted for
// caller compatibility; the deck copy intentionally omits the grace-days line
// (flag: add back a reassurance line if churn testing wants it).
const H7_VALUES_V2 = [
  { icon: 'video', text: <><strong>Unlimited recordings</strong>, transcripts, and AI notes with no time or storage limits.</> },
  { icon: 'workflow', text: <>Automate your CRM updates with <strong>CRM integrations</strong> and AI insight property mapping.</> },
  { icon: 'users', text: <>Automatically organize and share meetings with the right people using <strong>Teams</strong>.</> },
  { icon: 'plug', text: <>Make every meeting available to your AI through <strong>advanced MCP access</strong> and the Workspace API.</> },
  { icon: 'sparkles', text: <>Improve your team meetings with <strong>AI coaching</strong>, Trackers, and Scorecards.</> },
];
interface TrialExpiredInterstitialV2LiveProps {
  open: boolean;
  orgName?: string;
  graceDays?: number;
  onUpgrade?: () => void;
  onContinueFree?: () => void;
}
export function TrialExpiredInterstitialV2Live({ open, onUpgrade, onContinueFree }: TrialExpiredInterstitialV2LiveProps) {
  return (
    <Modal open={open} dismissible={false} bare>
      <div className="modal-v2 card-v2 h7-v2">
        <h2 className="h7-v2__title">Your Grain Business trial has ended</h2>
        <p className="h7-v2__sub">Upgrade to turn your team's meetings into shared knowledge.</p>
        <div className="h7-v2__panel">
          {H7_VALUES_V2.map((v, i) => (
            <div key={i} className="h7-v2__row"><Icon name={v.icon} size={18} /><span>{v.text}</span></div>
          ))}
        </div>
        <div className="h7-v2__foot">
          <button className="btn-v2 btn-v2--secondary" onClick={onContinueFree}>Remain on Free</button>
          <button className="btn-v2 btn-v2--primary" onClick={onUpgrade}>Upgrade</button>
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
        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
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
        {first}'s meeting just landed in your workspace. That's shared context your whole team can search and build on.
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
      <button className={`btn-v2 ${urgent ? 'btn-v2--warn' : 'btn-v2--primary'} btn-v2--full`} onClick={onUpgrade}><Icon name="gem" size={13} /> Upgrade now</button>
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
          <div className="tc-v2__bar"><span style={{ width: `${pct}%`, background: urgent ? '#C1542A' : undefined }} /></div>
          <div className="tc-v2__meta">Day {dayNum} of {TOTAL} · {orgName} · Grain Business</div>
          <div className="tc-v2__actions">
            <button className="btn-v2 btn-v2--ghost" onClick={onClose}>Maybe later</button>
            <button className={`btn-v2 ${urgent ? 'btn-v2--warn' : 'btn-v2--primary'} btn-v2--lg`} onClick={onUpgrade}><Icon name="gem" size={14} /> Upgrade now</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Inline settings upgrade (deck #2 Bot capture, #4 Templates, #20 Billing) ──
// Small in-context affordance beside a locked setting/plan row. Two variants:
// a solid button (sits next to a neutral action like "Customize") and a text
// link (sits inline next to a locked checkbox/label).
interface InlineUpgradeV2LiveProps { variant?: 'button' | 'link'; label?: string; onUpgrade?: () => void }
export function InlineUpgradeV2Live({ variant = 'button', label = 'Upgrade', onUpgrade }: InlineUpgradeV2LiveProps) {
  if (variant === 'link') return <button className="iu-v2__link" onClick={onUpgrade}>{label}</button>;
  return <button className="btn-v2 btn-v2--primary iu-v2__btn" onClick={onUpgrade}>{label}</button>;
}

// ── Upgrade pill for locked menu items (deck #9 actions menu, #10 player) ─────
interface UpgradeBadgeV2LiveProps { label?: string; onClick?: () => void }
export function UpgradeBadgeV2Live({ label = 'Upgrade', onClick }: UpgradeBadgeV2LiveProps) {
  return <button className="ubadge-v2" onClick={onClick}>{label}</button>;
}

// ── Trial-status header chip (deck #22 — meetings header, below the menu) ─────
interface TrialStatusChipV2LiveProps { text?: string; daysLeft?: number; onUpgrade?: () => void }
export function TrialStatusChipV2Live({ text, daysLeft = 1, onUpgrade }: TrialStatusChipV2LiveProps) {
  const label = text ?? `Teams expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
  return (
    <span className="tchip-v2">
      <Icon name="alert" size={13} />
      <span className="tchip-v2__text">{label}</span>
      <button className="tchip-v2__cta" onClick={onUpgrade}>Upgrade</button>
    </span>
  );
}

// ── Media-player locked overlay (deck #10 bot-capture, #11 local-capture) ─────
// Absolutely positioned over a blurred player frame (parent must be relative).
interface MediaLockOverlayV2LiveProps { kind?: 'limit' | 'locked'; onUpgrade?: () => void }
export function MediaLockOverlayV2Live({ kind = 'limit', onUpgrade }: MediaLockOverlayV2LiveProps) {
  const msg = kind === 'locked'
    ? 'This recording is locked, upgrade to view recording.'
    : 'Recording limit reached, upgrade to view recording.';
  return (
    <div className="mlock-v2">
      <span className="mlock-v2__icon"><Icon name="lock" size={22} /></span>
      <p className="mlock-v2__msg">{msg}</p>
      <button className="btn-v2 btn-v2--primary" onClick={onUpgrade}>Upgrade</button>
    </div>
  );
}

// ── Locked recording card, inline in the transcript (deck #12) ───────────────
// Inline sibling of H3's modal — same intent, but rendered in the record body
// rather than as an overlay. No duplication of H3's modal design.
interface LockedRecordingCardV2LiveProps { onStartTrial?: () => void }
export function LockedRecordingCardV2Live({ onStartTrial }: LockedRecordingCardV2LiveProps) {
  return (
    <div className="lrec-v2">
      <span className="lrec-v2__icon"><Icon name="lock" size={20} /></span>
      <div className="lrec-v2__title">This recording is locked</div>
      <p className="lrec-v2__desc">Start a Business trial to unlock this meeting and keep every meeting you record, for good.</p>
      <button className="btn-v2 btn-v2--primary btn-v2--lg" onClick={onStartTrial}>Start trial to unlock</button>
      <div className="lrec-v2__note">Included in Grain Business · free for 14 days</div>
    </div>
  );
}
