// TrialCountdown.jsx — Dismissible trial-countdown popup for the org workspace.
//
// After an org is created the creator is on a 14-day Grain Business trial.
// This popup auto-appears at milestone days remaining (14 / 8 / 5 / 3 / 1),
// is dismissible, and can be re-opened from the trial pill in the header.
//
// The hero uses generic category icons (not third-party brand logos) to
// suggest "Grain connects your stack" without recreating copyrighted marks.

const TRIAL_TOTAL = 14;
const TRIAL_MILESTONES = [14, 8, 5, 3, 1];

// Hero constellation — generic categories, deliberately not brand logos.
const TRIAL_NODES = [
  { icon: 'video',    pos: 'tl' },
  { icon: 'sparkles', pos: 'tr' },
  { icon: 'users',    pos: 'bl' },
  { icon: 'settings', pos: 'br' },
];

function TrialCountdown({ daysLeft, orgName = 'your organization', onUpgrade, onClose }) {
  if (daysLeft == null) return null;

  const urgent = daysLeft <= 3;
  const last = daysLeft <= 1;
  const heading = last ? 'Last day of your trial' : `${daysLeft} days left on trial`;
  const sub = urgent ?
    `Upgrade before your trial ends to keep ${orgName} and your shared meeting context.` :
    'Upgrade to keep using Grain with your team.';
  const dayNum = TRIAL_TOTAL - daysLeft;
  const pct = Math.max(2, Math.min(100, (dayNum / TRIAL_TOTAL) * 100));

  return (
    <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`trial-pop ${urgent ? 'trial-pop--urgent' : ''}`} role="dialog" aria-modal="true" aria-label="Trial countdown">
        <button className="trial-pop__close" aria-label="Dismiss" onClick={onClose}>
          <Icon name="close" size={16} stroke={2.25} />
        </button>

        <div className="trial-pop__hero">
          <div className="trial-pop__net">
            <svg className="trial-pop__links" aria-hidden="true">
              <line x1="50%" y1="50%" x2="13%" y2="26%" />
              <line x1="50%" y1="50%" x2="87%" y2="26%" />
              <line x1="50%" y1="50%" x2="13%" y2="74%" />
              <line x1="50%" y1="50%" x2="87%" y2="74%" />
            </svg>
            <span className="trial-pop__core">
              <img src="assets/grain-logo.png" alt="Grain"
                onError={(e) => { e.target.outerHTML = '<span class="trial-pop__coreMark">G</span>'; }} />
            </span>
            {TRIAL_NODES.map((n) =>
              <span key={n.pos} className={`trial-pop__node trial-pop__node--${n.pos}`}>
                <Icon name={n.icon} size={18} />
              </span>
            )}
          </div>
        </div>

        <div className="trial-pop__body">
          {urgent &&
            <div className="trial-pop__eyebrow"><Icon name="alert" size={13} /> Trial ending soon</div>
          }
          <h2 className="trial-pop__days">{heading}</h2>
          <p className="trial-pop__sub">{sub}</p>

          <div className="trial-pop__bar"><span style={{ width: `${pct}%` }} /></div>
          <div className="trial-pop__meta">{`Day ${dayNum} of ${TRIAL_TOTAL} · ${orgName} · Grain Business`}</div>

          <div className="trial-pop__actions">
            <button className="btn btn--ghost btn--pill" onClick={onClose}>
              <span className="btn-label">Maybe later</span>
            </button>
            <button className="btn btn--dark btn--pill btn--lg" onClick={onUpgrade}>
              <span className="btn-label">Upgrade now</span>
            </button>
          </div>
        </div>
      </div>
    </div>);
}

/* ── Trial widget — persistent sidebar card (replaces "Organization ready") ──
   Lives in the bottom-of-sidebar promo slot once an org is created. Shows
   days remaining + a progress bar, turns urgent at ≤3 days, and carries the
   Upgrade CTA. Clicking the meta row re-opens the full countdown popup. */
function TrialWidget({ daysLeft = TRIAL_TOTAL, orgName = 'your organization', onUpgrade, onOpen }) {
  const urgent = daysLeft <= 3;
  const last = daysLeft <= 1;
  const dayNum = TRIAL_TOTAL - daysLeft;
  const pct = Math.max(3, Math.min(100, (dayNum / TRIAL_TOTAL) * 100));
  const heading = last ? 'Last day of trial' : `${daysLeft} days left`;

  return (
    <div className={`trial-widget ${urgent ? 'trial-widget--urgent' : ''}`}>
      <button className="trial-widget__top" onClick={onOpen} title="View trial details">
        <span className="trial-widget__badge">
          <Icon name={urgent ? 'alert' : 'sparkles'} size={14} />
        </span>
        <span className="trial-widget__head">
          <span className="trial-widget__days">{heading}</span>
          <span className="trial-widget__plan">Grain Business trial</span>
        </span>
      </button>

      <div className="trial-widget__bar"><span style={{ width: `${pct}%` }} /></div>
      <div className="trial-widget__meta">{`Day ${dayNum} of ${TRIAL_TOTAL}`}</div>

      <button className="trial-widget__cta" onClick={onUpgrade}>
        <Icon name="sparkles" size={13} />
        <span className="btn-label">Upgrade now</span>
      </button>
    </div>);
}

Object.assign(window, { TrialCountdown, TrialWidget, TRIAL_MILESTONES, TRIAL_TOTAL });
