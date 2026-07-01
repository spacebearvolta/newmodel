import { Icon } from '../primitives/Icon';
import { Modal } from '../primitives/Modal';

export interface LockedMeeting {
  title: string;
  date: string;
}

// H3 · locked meeting (past the 30-day window). Opened by clicking a locked
// meeting row instead of hitting an empty error.
interface LockedMeetingModalProps {
  meeting: LockedMeeting | null;
  onClose?: () => void;
  onStartTrial?: () => void;
}

export function LockedMeetingModal({ meeting, onClose, onStartTrial }: LockedMeetingModalProps) {
  return (
    <Modal open={!!meeting} onClose={onClose} size="md">
      <button className="modal__close hook-modal__close" aria-label="Close" onClick={onClose}>
        <Icon name="close" />
      </button>
      <div className="modal__body hook-modal">
        <div className="hook-modal__mark hook-modal__mark--locked">
          <Icon name="lock" size={24} />
        </div>
        <h2 className="hook-modal__title">This meeting is locked</h2>
        {meeting && (
          <div className="hook-locked-row">
            <span className="hook-locked-row__thumb">
              <Icon name="lock" size={15} />
            </span>
            <span className="hook-locked-row__text">
              <span className="hook-locked-row__name">{meeting.title}</span>
              <span className="hook-locked-row__meta">{meeting.date}</span>
            </span>
          </div>
        )}
        <p className="hook-modal__sub">
          It’s older than 30 days — past what the free plan keeps. Start a Business trial to unlock this meeting and
          keep every meeting you record, for good.
        </p>
      </div>
      <div className="modal__foot modal__foot--end hook-modal__foot">
        <button className="btn btn--ghost btn--pill" onClick={onClose}>
          <span className="btn-label">Maybe later</span>
        </button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onStartTrial}>
          <span className="btn-label">Start free trial to unlock</span>
        </button>
      </div>
    </Modal>
  );
}
