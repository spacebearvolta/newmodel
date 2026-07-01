import { Icon } from '../primitives/Icon';

// H8 · feature-usage nudge (contextual, mid-trial). A subtle, non-blocking
// chip tied to a Business-only feature the user just reached during the
// trial. Dismissible.
interface FeatureNudgeChipProps {
  feature: string;
  daysLeft?: number;
  onDismiss?: () => void;
}

export function FeatureNudgeChip({ feature, daysLeft, onDismiss }: FeatureNudgeChipProps) {
  return (
    <div className="feature-nudge" role="status">
      <span className="feature-nudge__icon">
        <Icon name="sparkles" size={13} />
      </span>
      <span className="feature-nudge__text">
        <strong>{feature}</strong> is a Grain Business feature
        {daysLeft != null ? ` · ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your trial` : ''}
      </span>
      {onDismiss && (
        <button className="feature-nudge__close" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="close" size={13} />
        </button>
      )}
    </div>
  );
}
