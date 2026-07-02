import { Icon } from '../primitives/Icon';
import { Avatar } from '../primitives/Avatar';

export interface Invite {
  orgName: string;
  orgSlug: string;
  inviterName: string;
  inviterEmail: string;
  inviterRole: string;
  inviteDate: string;
  memberCount: number;
}

export function InviteStep({ invite, onAccept, onDecline, onClose }: {
  invite: Invite; onAccept?: () => void; onDecline?: () => void; onClose?: () => void;
}) {
  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <div className="modal__eyebrow"><Icon name="users" size={11} /> Organization invite</div>
          <h2 className="modal__title">{`${invite.inviterName.split(' ')[0]} invited you to join ${invite.orgName}`}</h2>
          <p className="modal__sub">{`${invite.memberCount} teammates already share meeting context in this organization.`}</p>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close" /></button>
      </div>
      <div className="modal__body">
        <div className="row" style={{ padding: '4px 0 18px', alignItems: 'center' }}>
          <Avatar name={invite.inviterName} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>{invite.inviterName}</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-5)' }}>{`${invite.inviterEmail} · ${invite.inviterRole}`}</div>
          </div>
        </div>
        <div className="kv-list" style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div className="kv-row"><span className="kv-row__key">Organization</span><span className="kv-row__val"><strong style={{ fontWeight: 600 }}>{invite.orgName}</strong></span></div>
          <div className="kv-row"><span className="kv-row__key">Your role</span><span className="kv-row__val">Member</span></div>
          <div className="kv-row"><span className="kv-row__key">Sent</span><span className="kv-row__val">{invite.inviteDate}</span></div>
        </div>
      </div>
      <div className="modal__foot modal__foot--split">
        <button className="btn btn--ghost btn--pill" onClick={onDecline}><span className="btn-label">Don't join</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onAccept}><span className="btn-label">Accept invite</span></button>
      </div>
    </>
  );
}

export function JExplainTransferStep({ orgName, meetingCount, inviterName, userName, onBack, onNext, onClose }: {
  orgName: string; meetingCount: number; inviterName: string; userName: string;
  onBack?: () => void; onNext?: () => void; onClose?: () => void;
}) {
  const lines = [
    `Your settings — capture preferences, integrations, templates — now apply inside ${orgName}.`,
    `Your ${meetingCount} meetings move into ${orgName}, and ${orgName} owns them going forward.`,
    `They will not be shared with anyone unless you share them — existing sharing stays exactly as you set it.`,
    `This is one-way. There's no separate personal space afterward; if you ever leave ${orgName}, moved meetings stay with the organization.`,
  ];
  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <h2 className="modal__title">{`Joining ${orgName} moves your meetings with you`}</h2>
          <p className="modal__sub">Two things happen when you join. You'll decide next — here's exactly what they are:</p>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close" /></button>
      </div>
      <div className="modal__body modal__body--tight">
        <div className="xfer-visual">
          <div className="xfer-party">
            <Avatar name={userName} size={44} />
            <div className="xfer-party__text">
              <div className="xfer-party__name">{userName}</div>
              <div className="xfer-party__sub">{`${meetingCount} meetings · your settings`}</div>
            </div>
          </div>
          <div className="xfer-arrow"><Icon name="arrowDown" size={16} /></div>
          <div className="xfer-party">
            <div className="xfer-party__icon xfer-party__icon--org"><Icon name="briefcase" size={22} /></div>
            <div className="xfer-party__text">
              <div className="xfer-party__name">{orgName}</div>
              <div className="xfer-party__sub">{`Organization · invited by ${inviterName}`}</div>
            </div>
          </div>
        </div>
        <p className="confirm-statement">Your past recordings move with you. They will not be shared with anyone unless you share them.</p>
        <ul className="bullets">{lines.map((l) => <li key={l}>{l}</li>)}</ul>
        <div className="warn-callout warn-callout--info">
          <div className="warn-callout__icon"><Icon name="info" size={16} /></div>
          <div className="warn-callout__text">Not ready? You can decline — nothing changes, and you keep using Grain on your own. <a href="#" onClick={(e) => e.preventDefault()}>Learn more</a></div>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--ghost btn--pill" onClick={onBack}><span className="btn-label">Back</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onNext}><span className="btn-label">Continue</span></button>
      </div>
    </>
  );
}

export function DecisionStep({ orgName, choice, onChoice, meetingCount = 6, onBack, onClose, onNext }: {
  orgName: string; choice: 'join' | 'decline' | null; onChoice: (c: 'join' | 'decline') => void;
  meetingCount?: number; onBack?: () => void; onClose?: () => void; onNext?: () => void;
}) {
  const nextLabel = choice === 'join' ? `Join ${orgName} & move my meetings` : choice === 'decline' ? 'Decline invite' : 'Continue';
  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <h2 className="modal__title">{`Join ${orgName} with your meetings?`}</h2>
          <p className="modal__sub">{`Joining moves your ${meetingCount} meetings into ${orgName} — there's no way to join without them.`}</p>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close" /></button>
      </div>
      <div className="modal__body modal__body--tight">
        <div className="choices">
          <button className={`choice ${choice === 'join' ? 'is-selected' : ''}`} onClick={() => onChoice('join')}>
            <div className="choice__line-icon"><Icon name="swap" size={20} /></div>
            <div className="choice__text">
              <div className="choice__title">Join — move my meetings</div>
              <div className="choice__desc">{`All ${meetingCount} meetings move into ${orgName}, and ${orgName} owns them going forward. They will not be shared with anyone unless you share them.`}</div>
            </div>
            <span className="choice__radio"><Icon name="check" size={12} stroke={3} /></span>
          </button>
          <button className={`choice ${choice === 'decline' ? 'is-selected' : ''}`} onClick={() => onChoice('decline')}>
            <div className="choice__line-icon"><Icon name="close" size={20} /></div>
            <div className="choice__text">
              <div className="choice__title">Don't join</div>
              <div className="choice__desc">Decline the invite. Nothing changes — you keep using Grain on your own, and your meetings stay where they are.</div>
            </div>
            <span className="choice__radio"><Icon name="check" size={12} stroke={3} /></span>
          </button>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--ghost btn--pill" onClick={onBack}><span className="btn-label">Back</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onNext} disabled={!choice}><span className="btn-label">{nextLabel}</span></button>
      </div>
    </>
  );
}

export function JoiningStep({ orgName }: { orgName: string }) {
  return (
    <div className="modal__body" style={{ padding: '36px 24px 36px' }}>
      <div className="loading-block">
        <div className="spinner" />
        <div>
          <div className="loading-block__title">{`Joining ${orgName}…`}</div>
          <div className="loading-block__sub">{`Moving your meetings into ${orgName}.`}</div>
        </div>
      </div>
    </div>
  );
}

export function JoinedStep({ orgName, meetingCount, inviterName, memberCount, onDone }: {
  orgName: string; meetingCount: number; inviterName: string; memberCount: number; onDone?: () => void;
}) {
  const summary = meetingCount > 0
    ? `Your ${meetingCount} meetings moved with you — they're not shared with anyone unless you share them.`
    : `You're a member. New meetings you capture are owned by ${orgName}.`;
  return (
    <>
      <div className="modal__body" style={{ padding: '36px 28px 8px' }}>
        <div className="success-block">
          <div className="success-block__mark"><Icon name="check" size={32} stroke={2.5} /></div>
          <div className="success-block__title">{`You're in ${orgName}`}</div>
          <div className="success-block__sub">{summary}</div>
        </div>
        <div className="kv-list" style={{ padding: '20px 8px 0', borderTop: '1px solid var(--border)', marginTop: 22 }}>
          <div className="kv-row"><span className="kv-row__key">Organization</span><span className="kv-row__val">{`${orgName} · ${memberCount + 1} members`}</span></div>
          <div className="kv-row"><span className="kv-row__key">Your role</span><span className="kv-row__val">Member</span></div>
          <div className="kv-row"><span className="kv-row__key">Invited by</span><span className="kv-row__val">{inviterName}</span></div>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--dark btn--pill btn--lg" onClick={onDone}><span className="btn-label">{`Open ${orgName}`}</span></button>
      </div>
    </>
  );
}

export function InvitePromoCard({ invite, onView }: { invite: Invite; onView?: () => void }) {
  return (
    <div className="card card--invite is-clickable" onClick={onView}>
      <div className="invite-card__hero">
        <div className="invite-card__avatars">
          <Avatar name={invite.inviterName} size={32} />
          <span className="invite-card__plus">+</span>
          <div className="invite-card__org-mark"><Icon name="briefcase" size={15} /></div>
        </div>
      </div>
      <span className="card__pill invite-card__pill"><Icon name="users" size={10} /> Organization invite</span>
      <p className="card__title">{`Join ${invite.orgName}`}</p>
      <p className="card__desc">{`${invite.inviterName.split(' ')[0]} invited you. ${invite.memberCount} teammates already share meeting context.`}</p>
      <div className="card__actions">
        <button className="card__cta card__cta--green" onClick={(e) => { e.stopPropagation(); onView?.(); }}>
          <span className="btn-label">Review invite</span>
        </button>
      </div>
    </div>
  );
}

export function JoinedPromoCard({ orgName }: { orgName: string }) {
  return (
    <div className="card">
      <div className="card__thumb" style={{ background: 'linear-gradient(135deg, #E6F7EE 0%, #C3ECD5 100%)', textAlign: 'center', padding: '18px 14px' }}>
        <Icon name="check" size={24} stroke={2.5} style={{ color: '#0B6F3F' }} />
      </div>
      <p className="card__title">{`You're in ${orgName}`}</p>
      <p className="card__desc">Find shared meetings in the organization library.</p>
    </div>
  );
}

export function DeclinedPromoCard() {
  return (
    <div className="card">
      <div className="card__thumb">
        <div className="card__line" /><div className="card__line" /><div className="card__line" />
      </div>
      <p className="card__title">Keep using Grain personally</p>
      <p className="card__desc">You declined the invite. Your account stays personal.</p>
    </div>
  );
}
