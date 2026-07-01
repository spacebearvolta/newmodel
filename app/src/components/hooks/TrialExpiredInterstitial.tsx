import { Icon } from '../primitives/Icon';
import { Modal } from '../primitives/Modal';

// H7 · trial-expired grace-state interstitial. Full-screen, shown once on
// the first login after the trial ends. The workspace isn't deleted: its
// meetings sit in a grace window.
interface TrialExpiredInterstitialProps {
  open: boolean;
  orgName?: string;
  graceDays?: number;
  onUpgrade?: () => void;
  onContinueFree?: () => void;
}

export function TrialExpiredInterstitial({
  open,
  orgName = 'your organization',
  graceDays = 30,
  onUpgrade,
  onContinueFree,
}: TrialExpiredInterstitialProps) {
  return (
    <Modal open={open} dismissible={false} size="xl">
      <div className="modal__body trial-expired">
        <span className="trial-expired__mark">
          <Icon name="clock" size={26} />
        </span>
        <h2 className="trial-expired__title">Your Grain Business trial has ended</h2>
        <p className="trial-expired__sub">
          Nothing’s gone. {orgName}’s shared meetings are saved for {graceDays} days — reactivate to switch your
          workspace back on and keep everything, or continue on a free account.
        </p>
        <div className="trial-expired__grace">
          <span className="trial-expired__graceIcon">
            <Icon name="shield" size={16} />
          </span>
          <div className="trial-expired__graceText">
            <div className="trial-expired__graceTitle">Saved for {graceDays} days</div>
            <div className="trial-expired__graceSub">
              Your organization’s meeting history stays recoverable during this window. We’ll remind you before
              anything is removed.
            </div>
          </div>
        </div>
        <ul className="hook-values trial-expired__values">
          <li className="hook-values__item">
            <span className="hook-values__icon">
              <Icon name="infinity" size={15} />
            </span>
            <span>No 45-minute recording cap</span>
          </li>
          <li className="hook-values__item">
            <span className="hook-values__icon">
              <Icon name="history" size={15} />
            </span>
            <span>Unlimited meeting history</span>
          </li>
          <li className="hook-values__item">
            <span className="hook-values__icon">
              <Icon name="users" size={15} />
            </span>
            <span>Your team’s shared meeting library, back on</span>
          </li>
        </ul>
      </div>
      <div className="modal__foot modal__foot--end hook-modal__foot">
        <button className="btn btn--pill" onClick={onContinueFree}>
          <span className="btn-label">Continue with free account</span>
        </button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onUpgrade}>
          <span className="btn-label">Upgrade now</span>
        </button>
      </div>
    </Modal>
  );
}
