import { Icon } from '../primitives/Icon';

const TRIAL_TOTAL = 14;

// Trial widget — persistent sidebar card shown once an org is created.
// Shows days remaining + a progress bar, turns urgent at ≤3 days, and
// carries the Upgrade CTA. Clicking the meta row re-opens the countdown
// popup.
interface TrialWidgetProps {
  daysLeft?: number;
  orgName?: string;
  onUpgrade?: () => void;
  onOpen?: () => void;
}

export function TrialWidget({ daysLeft = TRIAL_TOTAL, onUpgrade, onOpen }: TrialWidgetProps) {
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

      <div className="trial-widget__bar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="trial-widget__meta">{`Day ${dayNum} of ${TRIAL_TOTAL}`}</div>

      <button className="trial-widget__cta" onClick={onUpgrade}>
        <Icon name="sparkles" size={13} />
        <span className="btn-label">Upgrade now</span>
      </button>
    </div>
  );
}
