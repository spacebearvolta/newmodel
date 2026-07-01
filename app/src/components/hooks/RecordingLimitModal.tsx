import { Icon } from '../primitives/Icon';
import { Modal } from '../primitives/Modal';
import { HookValueList, HOOK_VALUE_POINTS } from './HookValueList';

// H1 · 45-minute recording / upload wall. Blocking modal shown when a free
// user starts a capture or uploads a file that would run past the cap.
interface RecordingLimitModalProps {
  open: boolean;
  kind?: 'record' | 'upload';
  onClose?: () => void;
  onStartTrial?: () => void;
}

export function RecordingLimitModal({ open, kind = 'record', onClose, onStartTrial }: RecordingLimitModalProps) {
  const isUpload = kind === 'upload';
  return (
    <Modal open={open} onClose={onClose} size="md">
      <button className="modal__close hook-modal__close" aria-label="Close" onClick={onClose}>
        <Icon name="close" />
      </button>
      <div className="modal__body hook-modal">
        <div className="hook-modal__mark">
          <Icon name="clock" size={26} />
        </div>
        <h2 className="hook-modal__title">
          {isUpload ? 'This recording is longer than 45 minutes' : 'Free recordings stop at 45 minutes'}
        </h2>
        <p className="hook-modal__sub">
          {isUpload
            ? 'Free accounts cap recordings at 45 minutes. Start a Business trial to upload and transcribe meetings of any length.'
            : 'Free accounts cap recordings at 45 minutes. Start a Business trial to record without limits — every meeting captured end to end.'}
        </p>
        <HookValueList points={HOOK_VALUE_POINTS.slice(0, 3)} />
      </div>
      <div className="modal__foot modal__foot--end hook-modal__foot">
        <button className="btn btn--ghost btn--pill" onClick={onClose}>
          <span className="btn-label">Maybe later</span>
        </button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onStartTrial}>
          <span className="btn-label">Start free trial</span>
        </button>
      </div>
    </Modal>
  );
}
