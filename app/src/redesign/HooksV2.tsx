// HooksV2.tsx — redesign exploration. NOT wired into the production Hook
// Gallery; these are comparison mockups for Alex to react to before any
// baseline component changes. See CLAUDE.md / the comparison artifact for
// context. Grain green stays primary; shapes/radius follow DESIGN.md.
import { Icon } from '../components/primitives/Icon';
import grainLogo from '../assets/grain-logo.png';

// No logo mark here for now, per Alex — the grain-logo.png stand-in from
// the last round is gone; don't stand in with anything else until she
// shares the real Grain logo file. Plain text tag only.
const EYEBROW = <span className="eyebrow-v2">Grain Business · free for 14 days</span>;

// Rough approximation of HubSpot's mark (no real asset available — not in
// the icon catalog, and none was attached). Swap for the exact logo file
// when Alex provides one.
function HubSpotMarkV2() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="13" r="6" />
      <circle cx="18" cy="6" r="2.4" fill="currentColor" stroke="none" />
      <line x1="16.3" y1="7.7" x2="14.3" y2="9.7" />
    </svg>
  );
}

// ── H1 v2 ───────────────────────────────────────────────────────────────
export function RecordingLimitModalV2({ kind = 'record' }: { kind?: 'record' | 'upload' }) {
  const isUpload = kind === 'upload';
  return (
    <div className="modal-v2 card-v2" style={{ width: 440 }}>
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
        <button className="btn-v2 btn-v2--primary btn-v2--full btn-v2--lg">
          Start free trial
        </button>
        <button className="h1-v2__link">Maybe later</button>
      </div>
    </div>
  );
}

// ── H2 v2 ───────────────────────────────────────────────────────────────
export function HistoryLockBannerV2({ daysLeft = 5 }: { daysLeft?: number }) {
  return (
    <div className="h2-v2" style={{ width: 560 }}>
      <span className="h2-v2__icon"><Icon name="history" size={16} /></span>
      <span className="h2-v2__text">
        <span className="h2-v2__title">Some of your meetings will lock in {daysLeft} day{daysLeft === 1 ? '' : 's'}</span>
        <span className="h2-v2__body">
          Try <button className="ms-history-banner__link">Grain Business</button> to keep your meeting history searchable, forever.
        </span>
      </span>
      <button className="h2-v2__close" aria-label="Dismiss"><Icon name="close" size={14} /></button>
    </div>
  );
}

// ── H3 v2 ───────────────────────────────────────────────────────────────
export function LockedMeetingModalV2() {
  return (
    <div className="modal-v2 card-v2" style={{ width: 440 }}>
      <div className="h3-v2">
        <h2 className="h3-v2__title">This meeting is locked</h2>
        <div className="h3-v2__row">
          <span className="h3-v2__thumb"><Icon name="lock" size={13} /></span>
          <span>
            <span className="h3-v2__name">Q2 planning offsite — day 1</span>
            <span className="h3-v2__meta">Recorded May 8</span>
          </span>
        </div>
        <p className="h3-v2__sub">Start a Business trial to unlock this meeting and keep every meeting you record, for good.</p>
      </div>
      <div className="h1-v2__foot" style={{ paddingTop: 0 }}>
        <button className="btn-v2 btn-v2--primary btn-v2--full btn-v2--lg">
          Start free trial to unlock
        </button>
        <button className="h1-v2__link">Maybe later</button>
      </div>
    </div>
  );
}

// ── H4/H5 v2 ──────────────────────────────────────────────────────────────
export function TeamValueModalV2({ trigger = 'invite' as 'invite' | 'share' }) {
  const copy = trigger === 'share'
    ? { title: 'Share this meeting with your team', sub: 'Give your team the full context of every call — not just the parts they were in.', cta: 'Start free trial to share' }
    : { title: 'Work is better, together.', sub: 'Invite your whole team — everyone’s shared meetings build one searchable, AI-ready memory.', cta: 'Start free trial to invite' };
  return (
    <div className="h45-v2" style={{ width: 620 }}>
      <div className="h45-v2__inner">
        <div>
          {EYEBROW}
          <h2 className="h45-v2__title">{copy.title}</h2>
          <p className="h45-v2__sub">{copy.sub}</p>
          <ul className="h45-v2__values">
            <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="infinity" size={13} /></span> No 45-minute recording cap</li>
            <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="history" size={13} /></span> Unlimited meeting history</li>
            <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="users" size={13} /></span> A shared library your whole team can search</li>
            <li><span className="mark-v2" style={{ width: 26, height: 26, borderRadius: 6 }}><Icon name="plug" size={13} /></span> Integrations & API — HubSpot, Salesforce, Slack</li>
          </ul>
          <div className="h1-v2__foot" style={{ padding: 0, marginTop: 22 }}>
            <button className="btn-v2 btn-v2--primary btn-v2--lg btn-v2--full">{copy.cta}</button>
            <button className="h1-v2__link">Not now</button>
          </div>
        </div>
        <div className="card-v2 h45-v2__preview" style={{ background: 'var(--bg-alt)', padding: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-4)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Icon name="users" size={13} /> Team meetings</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Q2 planning offsite — day 1',
              'Discovery call — Quest.io',
              'Weekly sync — Product',
              '1:1 with Jordan',
              'Customer renewal — Northwind',
              'Sprint retro',
              'Onboarding — new hire',
            ].map((title) => (
              <div key={title} className="card-v2" style={{ padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 6, background: 'var(--green-100)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name="video" size={14} />
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── H6 v2 ───────────────────────────────────────────────────────────────
export function HgGateCardV2() {
  return (
    <div className="modal-v2 card-v2" style={{ width: 420, padding: '30px 32px', textAlign: 'center' }}>
      <div className="mark-v2" style={{ margin: '0 auto 14px', width: 44, height: 44, background: '#FF7A59', color: '#fff' }}>
        <HubSpotMarkV2 />
      </div>
      <h2 style={{ font: '700 19px/1.25 var(--font-sans)', color: 'var(--fg-1)', margin: '0 0 8px' }}>Try Grain Business to connect HubSpot</h2>
      <p style={{ fontSize: 13.5, color: 'var(--fg-4)', lineHeight: 1.55, margin: '0 auto 20px', maxWidth: 320 }}>
        Skip the manual data entry — auto-sync AI notes to HubSpot Contact and Meeting objects.
      </p>
      <button className="btn-v2 btn-v2--primary btn-v2--full btn-v2--lg">Start free trial</button>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-5)' }}>Grain Business · free for 14 days</div>
    </div>
  );
}

// ── H7 v2 (interstitial) ──────────────────────────────────────────────────
// Restructured into the same two-column pattern as H4/H5 per Alex — no top
// icon mark, no separate "Saved for X days" banner (the meeting rows on the
// right make the stakes concrete instead: which meetings are over the
// 45-min cap, and how long until history locks).
// Red only if: minutes > 45, OR locking in under 7 days, OR already past the
// 30-day window (daysOld set). Being merely "locks in N days" with N >= 7 is
// not urgent enough to flag.
// Ordered top to bottom by urgency: soonest-to-lock first, already-locked
// (oldest) last — "locking in 5 days" leads the list per Alex.
const H7_MEETINGS_V2: { title: string; minutes: number; locksInDays?: number; daysOld?: number }[] = [
  { title: 'Weekly sync — Product', minutes: 34, locksInDays: 5 },
  { title: 'Q2 planning offsite — day 1', minutes: 52, locksInDays: 12 },
  { title: 'Discovery call — Quest.io', minutes: 38, locksInDays: 12 },
  { title: '1:1 with Jordan', minutes: 22, locksInDays: 20 },
  { title: 'Customer renewal — Northwind', minutes: 30, daysOld: 32 },
  { title: 'Onboarding — new hire', minutes: 28, daysOld: 38 },
  { title: 'Sprint retro', minutes: 61, daysOld: 45 },
];

export function TrialExpiredInterstitialV2({ orgName = 'Acme', graceDays = 30 }: { orgName?: string; graceDays?: number }) {
  return (
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
          <button className="btn-v2 btn-v2--primary btn-v2--lg btn-v2--full"><Icon name="gem" size={14} /> Upgrade now</button>
          <button className="h1-v2__link">Continue with free account</button>
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
                <span style={{
                  width: 30, height: 30, borderRadius: 6, background: 'var(--green-100)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name="video" size={14} />
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</span>
                  <span style={{ display: 'block', fontSize: 11, color: flagged ? '#C2410C' : 'var(--fg-5)' }}>
                    {m.minutes} min · {statusText}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── H7 companion v2 ───────────────────────────────────────────────────────
export function TrialEndedCardV2({ orgName = 'Acme', graceDays }: { orgName?: string; graceDays?: number }) {
  const urgent = graceDays != null && graceDays <= 7;
  return (
    <div className="tec-v2" style={{ width: 244 }}>
      <div className="tec-v2__title">Trial ended</div>
      <p className="tec-v2__desc">Everything stays saved. Meetings shared by teammates unlock when {orgName} is active again.</p>
      {urgent && (
        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#C2410C', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="alert" size={13} /> {graceDays} {graceDays === 1 ? 'day' : 'days'} until history is deleted
        </p>
      )}
      <button className="btn-v2 btn-v2--primary btn-v2--full"><Icon name="gem" size={13} /> Upgrade</button>
      <button className="btn-v2 btn-v2--ghost btn-v2--full" style={{ marginTop: 6 }}>Talk to sales</button>
    </div>
  );
}

// ── H8 v2 ───────────────────────────────────────────────────────────────
const FEATURE_ICON: Record<string, string> = {
  'Team meetings': 'users',
  'Sharing to a team': 'share2',
  'AI actions on shared meetings': 'sparkles',
  'Workspace integrations': 'plug',
};

export function FeatureNudgeChipV2({ feature, daysLeft }: { feature: string; daysLeft?: number }) {
  return (
    <div className="h8-v2">
      <span className="h8-v2__icon"><Icon name={FEATURE_ICON[feature] ?? 'users'} size={14} /></span>
      <span className="h8-v2__text">
        <strong>{feature}</strong> is a Grain Business feature
        {daysLeft != null ? ` · ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your trial` : ''}
      </span>
      <button className="h8-v2__close" aria-label="Dismiss"><Icon name="close" size={12} /></button>
    </div>
  );
}

// ── H9 v2 ───────────────────────────────────────────────────────────────
export function TeammateNudgeV2({ name = 'Maya Chen', daysLeft }: { name?: string; daysLeft?: number }) {
  const first = name.split(' ')[0];
  return (
    <div className="h9-v2">
      <button className="h9-v2__close" aria-label="Dismiss"><Icon name="close" size={14} /></button>
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
        {first}’s meeting just landed in your workspace — that’s shared context your whole team can search and build on.
      </p>
      <div className="h9-v2__actions">
        <button className="btn-v2 btn-v2--ghost">Not now</button>
        <button className="btn-v2 btn-v2--dark">View meeting summary</button>
      </div>
    </div>
  );
}

// ── Trial widget v2 ───────────────────────────────────────────────────────
export function TrialWidgetV2({ daysLeft = 14 }: { daysLeft?: number }) {
  const TOTAL = 14;
  const urgent = daysLeft <= 3;
  const dayNum = TOTAL - daysLeft;
  const pct = Math.max(3, Math.min(100, (dayNum / TOTAL) * 100));
  return (
    <div className="tw-v2" style={{ width: 244 }}>
      <button className="tw-v2__top">
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
      <button className="btn-v2 btn-v2--primary btn-v2--full"><Icon name="gem" size={13} /> Upgrade now</button>
    </div>
  );
}

// Hero constellation — generic categories, deliberately not brand logos.
// Restored from the original TrialCountdown.tsx per Alex: "this was
// correct" — the v2 pass had flattened this into a plain gradient + badge,
// which was a regression, not an improvement.
const TRIAL_NODES_V2: { icon: string; pos: 'tl' | 'tr' | 'bl' | 'br' }[] = [
  { icon: 'video', pos: 'tl' },
  { icon: 'sparkles', pos: 'tr' },
  { icon: 'users', pos: 'bl' },
  { icon: 'settings', pos: 'br' },
];

// ── Trial countdown popup v2 ──────────────────────────────────────────────
export function TrialCountdownV2({ daysLeft = 8, orgName = 'Acme' }: { daysLeft?: number; orgName?: string }) {
  const TOTAL = 14;
  const urgent = daysLeft <= 3;
  const dayNum = TOTAL - daysLeft;
  const pct = Math.max(2, Math.min(100, (dayNum / TOTAL) * 100));
  return (
    <div className="tc-v2">
      <button className="trial-pop__close" aria-label="Dismiss">
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
            <img
              src={grainLogo}
              alt="Grain"
              onError={(e) => { (e.target as HTMLImageElement).outerHTML = '<span class="trial-pop__coreMark">G</span>'; }}
            />
          </span>
          {TRIAL_NODES_V2.map((n) => (
            <span key={n.pos} className={`trial-pop__node trial-pop__node--${n.pos}`}>
              <Icon name={n.icon} size={18} />
            </span>
          ))}
        </div>
      </div>
      <div className="tc-v2__body">
        <h2 className="tc-v2__days">{daysLeft <= 1 ? 'Last day of your trial' : `${daysLeft} days left on trial`}</h2>
        <p className="tc-v2__sub">
          {urgent ? `Upgrade before your trial ends to keep ${orgName} and your shared meeting context.` : 'Upgrade to keep using Grain with your team.'}
        </p>
        <div className="tc-v2__bar"><span style={{ width: `${pct}%` }} /></div>
        <div className="tc-v2__meta">Day {dayNum} of {TOTAL} · {orgName} · Grain Business</div>
        <div className="tc-v2__actions">
          <button className="btn-v2 btn-v2--ghost">Maybe later</button>
          <button className="btn-v2 btn-v2--primary btn-v2--lg"><Icon name="gem" size={14} /> Upgrade now</button>
        </div>
      </div>
    </div>
  );
}
