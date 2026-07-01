import { Icon } from '../primitives/Icon';

// H2 · meeting history approaching the 30-day lock. Ambient, dismissible
// banner — a heads-up, not a blocker. Sits atop the meetings list.
interface HistoryLockBannerProps {
  daysLeft?: number;
  onStartTrial?: () => void;
  onDismiss?: () => void;
}

export function HistoryLockBanner({ daysLeft = 5, onStartTrial, onDismiss }: HistoryLockBannerProps) {
  return (
    <div className="ms-history-banner" role="status">
      <span className="ms-history-banner__icon">
        <Icon name="history" size={17} />
      </span>
      <div className="ms-history-banner__text">
        <span className="ms-history-banner__title">
          {`Some of your meetings will lock in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
        </span>
        <span className="ms-history-banner__body">
          The free plan has a 30 day meeting history. Try Grain Business to keep your meeting history searchable.
        </span>
      </div>
      <button className="ms-history-banner__trial" onClick={onStartTrial}>
        <Icon name="sparkles" size={13} /> <span className="btn-label">Start free trial</span>
      </button>
      <button className="ms-history-banner__close" aria-label="Dismiss" title="Dismiss" onClick={onDismiss}>
        <Icon name="close" size={15} />
      </button>
    </div>
  );
}
