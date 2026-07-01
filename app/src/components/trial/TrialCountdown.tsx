import { Icon } from '../primitives/Icon';
import grainLogo from '../../assets/grain-logo.png';

const TRIAL_TOTAL = 14;

// Hero constellation — generic categories, deliberately not brand logos.
const TRIAL_NODES: { icon: string; pos: 'tl' | 'tr' | 'bl' | 'br' }[] = [
  { icon: 'video', pos: 'tl' },
  { icon: 'sparkles', pos: 'tr' },
  { icon: 'users', pos: 'bl' },
  { icon: 'settings', pos: 'br' },
];

// Dismissible trial-countdown popup for the org workspace. After an org is
// created the creator is on a 14-day Grain Business trial; this popup
// auto-appears at milestone days remaining and can be re-opened from the
// trial pill in the header.
interface TrialCountdownProps {
  daysLeft?: number | null;
  orgName?: string;
  onUpgrade?: () => void;
  onClose?: () => void;
}

export function TrialCountdown({ daysLeft, orgName = 'your organization', onUpgrade, onClose }: TrialCountdownProps) {
  if (daysLeft == null) return null;

  const urgent = daysLeft <= 3;
  const last = daysLeft <= 1;
  const heading = last ? 'Last day of your trial' : `${daysLeft} days left on trial`;
  const sub = urgent
    ? `Upgrade before your trial ends to keep ${orgName} and your shared meeting context.`
    : 'Upgrade to keep using Grain with your team.';
  const dayNum = TRIAL_TOTAL - daysLeft;
  const pct = Math.max(2, Math.min(100, (dayNum / TRIAL_TOTAL) * 100));

  return (
    <div
      className="scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
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
              <img
                src={grainLogo}
                alt="Grain"
                onError={(e) => {
                  (e.target as HTMLImageElement).outerHTML = '<span class="trial-pop__coreMark">G</span>';
                }}
              />
            </span>
            {TRIAL_NODES.map((n) => (
              <span key={n.pos} className={`trial-pop__node trial-pop__node--${n.pos}`}>
                <Icon name={n.icon} size={18} />
              </span>
            ))}
          </div>
        </div>

        <div className="trial-pop__body">
          {urgent && (
            <div className="trial-pop__eyebrow">
              <Icon name="alert" size={13} /> Trial ending soon
            </div>
          )}
          <h2 className="trial-pop__days">{heading}</h2>
          <p className="trial-pop__sub">{sub}</p>

          <div className="trial-pop__bar">
            <span style={{ width: `${pct}%` }} />
          </div>
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
    </div>
  );
}
