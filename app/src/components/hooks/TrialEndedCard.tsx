import { Icon } from '../primitives/Icon';

// H7 companion · persistent sidebar card once the trial has ended. Carries
// a deletion countdown in the final grace-period days.
interface TrialEndedCardProps {
  orgName?: string;
  graceDays?: number;
  onUpgrade?: () => void;
  onTalkToSales?: () => void;
  onDismiss?: () => void;
}

export function TrialEndedCard({ orgName = 'your organization', graceDays, onUpgrade, onTalkToSales, onDismiss }: TrialEndedCardProps) {
  const urgent = graceDays != null && graceDays <= 7;
  return (
    <div className="trial-ended-card">
      <button className="trial-ended-card__dismiss" aria-label="Dismiss" title="Dismiss" onClick={onDismiss}>
        <Icon name="close" size={13} stroke={2.25} />
      </button>
      <div className="trial-ended-card__top">
        <span className="trial-ended-card__head">
          <span className="trial-ended-card__title">Trial ended</span>
        </span>
      </div>
      <p className="trial-ended-card__desc">
        Everything stays saved. Meetings you recorded or joined are yours. Meetings shared by teammates unlock when{' '}
        {orgName} is active again.
      </p>
      {urgent && (
        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#C2410C', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="alert" size={13} /> {graceDays} {graceDays === 1 ? 'day' : 'days'} until history is deleted
        </p>
      )}
      <button className="trial-ended-card__cta" onClick={onUpgrade}>
        <Icon name="upgradeCircle" size={13} />
        <span className="btn-label">Upgrade</span>
      </button>
      <button className="trial-ended-card__sales" onClick={onTalkToSales}>
        <span className="btn-label">Talk to sales</span>
      </button>
    </div>
  );
}
