import { Icon } from '../primitives/Icon';
import { Modal } from '../primitives/Modal';
import { HookValueList } from './HookValueList';

// H4 / H5 · team value-education modal (Invite & Share). Leads with the
// outcome and a dimmed preview of a team workspace, then offers the trial.
type Trigger = 'invite' | 'share';

const TEAM_MODAL_COPY: Record<Trigger, { title: string; sub: string; cta: string }> = {
  invite: {
    title: 'Work is better, together.',
    sub: 'Try Grain Business and invite your whole team — everyone’s shared meetings build one searchable, AI-ready memory.',
    cta: 'Start free trial to invite',
  },
  share: {
    title: 'Share this meeting with your team',
    sub: 'Try out Grain Business, where your team can share meetings and get the full context of every call — not just the parts they were in.',
    cta: 'Start free trial to share',
  },
};

function TeamWorkspacePreview() {
  const rows: [number, number][] = [[58, 32], [44, 26], [66, 38], [38, 22]];
  return (
    <div className="hook-preview" aria-hidden="true">
      <div className="hook-preview__bar">
        <span className="hook-preview__title">
          <Icon name="users" size={13} /> Team meetings
        </span>
        <span className="hook-preview__chip" />
      </div>
      {rows.map((w, i) => (
        <div key={i} className="hook-preview__row">
          <span className="hook-preview__thumb" />
          <span className="hook-preview__lines">
            <i style={{ width: `${w[0]}%` }} />
            <i style={{ width: `${w[1]}%` }} />
          </span>
          <span className="hook-preview__avatar" />
          <span className="hook-preview__pill" />
        </div>
      ))}
    </div>
  );
}

interface TeamValueModalProps {
  trigger: Trigger | null;
  onClose?: () => void;
  onStartTrial?: () => void;
}

export function TeamValueModal({ trigger, onClose, onStartTrial }: TeamValueModalProps) {
  const copy = trigger ? TEAM_MODAL_COPY[trigger] : TEAM_MODAL_COPY.invite;
  return (
    <Modal open={!!trigger} onClose={onClose} size="lg">
      <button className="modal__close hook-modal__close" aria-label="Close" onClick={onClose}>
        <Icon name="close" />
      </button>
      <div className="modal__body hook-team">
        <div className="hook-team__copy">
          <div className="hook-team__eyebrow">
            <Icon name="sparkles" size={13} /> Grain Business · free for 14 days
          </div>
          <h2 className="hook-team__title">{copy.title}</h2>
          <p className="hook-team__sub">{copy.sub}</p>
          <HookValueList />
        </div>
        <div className="hook-team__visual">
          <TeamWorkspacePreview />
        </div>
      </div>
      <div className="modal__foot modal__foot--end hook-modal__foot">
        <button className="btn btn--ghost btn--pill" onClick={onClose}>
          <span className="btn-label">Not now</span>
        </button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onStartTrial}>
          <span className="btn-label">{copy.cta}</span>
        </button>
      </div>
    </Modal>
  );
}
