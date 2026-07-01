import { Icon } from '../primitives/Icon';
import { Avatar } from '../primitives/Avatar';

// H9 · teammate engagement nudge. In-app notification to the trial owner
// the moment a teammate's first meeting is captured — proof the trial is
// delivering. Bottom-right card.
interface TeammateNudgeProps {
  name?: string;
  daysLeft?: number;
  onView?: () => void;
  onClose?: () => void;
}

export function TeammateNudge({ name = 'Maya Chen', daysLeft, onView, onClose }: TeammateNudgeProps) {
  const first = name.split(' ')[0];
  return (
    <div className="teammate-nudge" role="status">
      <button className="teammate-nudge__close" aria-label="Dismiss" onClick={onClose}>
        <Icon name="close" size={14} />
      </button>
      <div className="teammate-nudge__head">
        <Avatar name={name} size={38} />
        <div className="teammate-nudge__headtext">
          <span className="teammate-nudge__eyebrow">
            <Icon name="sparkles" size={12} /> Your trial is working
          </span>
          <span className="teammate-nudge__title">{first} just captured their first meeting</span>
        </div>
      </div>
      <p className="teammate-nudge__body">
        {first}’s meeting just landed in your workspace — that’s shared context your whole team can search and build
        on. Keep it going{daysLeft != null ? ` · ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your trial` : ''}.
      </p>
      <div className="teammate-nudge__actions">
        <button className="btn btn--ghost btn--pill" onClick={onClose}>
          <span className="btn-label">Dismiss</span>
        </button>
        <button className="btn btn--dark btn--pill" onClick={onView}>
          <span className="btn-label">See the meeting</span>
        </button>
      </div>
    </div>
  );
}
