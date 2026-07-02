import { useState } from 'react';
import { Icon } from '../primitives/Icon';
import { Avatar } from '../primitives/Avatar';
import claudeIcon from '../../assets/claude-icon.png';
import type { Peer } from '../../data/meetings';

// ── Post-first-meeting Claude / MCP connector ──────────────────────────────
export function ClaudeMeetingBanner({ onConnect, onDismiss }: { onConnect?: () => void; onDismiss?: () => void }) {
  return (
    <div className="ms-claude-banner" role="region" aria-label="Connect Grain to Claude">
      <span className="ms-claude-banner__icon"><img src={claudeIcon} alt="Claude" /></span>
      <div className="ms-claude-banner__text">
        <div className="ms-claude-banner__title">Put your first meeting to work in Claude</div>
        <div className="ms-claude-banner__body">Connect Grain to Claude to ask questions, draft follow-ups, and use your meetings as context in your AI workflows.</div>
      </div>
      <div className="ms-claude-banner__actions">
        <button className="btn btn--dark btn--pill" onClick={onConnect}><span className="btn-label">Connect in Claude</span></button>
        <button className="btn btn--ghost btn--pill" onClick={onDismiss}><span className="btn-label">Dismiss</span></button>
      </div>
    </div>
  );
}

export function ClaudeHandoff({ onReturn }: { onReturn?: () => void }) {
  return (
    <>
      <div className="modal__body" style={{ padding: '36px 28px 8px' }}>
        <div className="success-block">
          <div className="success-block__mark" style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--fg-2)' }}>
            <Icon name="ext" size={28} />
          </div>
          <div className="success-block__title">Finish connecting in Claude</div>
          <div className="success-block__sub">Claude will open in your browser to finish connecting Grain. Once you're done there, come back: your meeting context will be available in Claude.</div>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--dark btn--pill btn--lg" onClick={onReturn}><span className="btn-label">Return to Grain</span></button>
      </div>
    </>
  );
}

// ── Promo cards ─────────────────────────────────────────────────────────────
export function StartTrialPromo({ orgCreated, onClick, onDismiss }: { orgCreated?: boolean; onClick?: () => void; onDismiss?: () => void }) {
  if (orgCreated) {
    return (
      <div className="stp-v2">
        <span className="mark-v2" style={{ width: 40, height: 40, marginBottom: 10 }}><Icon name="check" size={18} stroke={2.5} /></span>
        <p className="stp-v2__title">Organization ready</p>
        <p className="stp-v2__desc">Invite teammates from Members anytime.</p>
      </div>
    );
  }
  return (
    <div className="stp-v2 stp-v2--clickable" onClick={onClick}>
      <button className="stp-v2__dismiss" aria-label="Dismiss" title="Dismiss" onClick={(e) => { e.stopPropagation(); onDismiss?.(); }}>
        <Icon name="close" size={13} stroke={2.25} />
      </button>
      <span className="mark-v2" style={{ width: 40, height: 40, marginBottom: 10 }}><Icon name="gem" size={18} /></span>
      <p className="stp-v2__title">Work with your team</p>
      <p className="stp-v2__desc">Try Grain Business to get the power of shared meeting context.</p>
      <button className="btn-v2 btn-v2--primary btn-v2--full" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>Start trial</button>
    </div>
  );
}

// ── Trial bento — shared entry point for "Start trial" outside first-run ──
export function TrialBentoStep({ onStart, onSelf, onClose }: { onStart?: () => void; onSelf?: () => void; onClose?: () => void }) {
  return (
    <>
      <button className="modal__close trial-bento__close" aria-label="Close" onClick={onClose}><Icon name="close" /></button>
      <div className="modal__body trial-bento">
        <h2 className="trial-bento__title">Business plan is free for 14 days</h2>
        <p className="trial-bento__sub">Power your organization's AI work with team meeting intelligence.</p>

        <div className="ob-bento">
          <div className="ob-cell ob-cell--wide ob-cell--hero">
            <div className="ob-cell__title">Organization workspace</div>
            <div className="ob-cell__desc">Make AI smarter with the full context of your team meetings.</div>
            <div className="ob-cell__tag">Shared context</div>
          </div>
          <div className="ob-cell ob-cell--mini">
            <div className="ob-cell__title"><Icon name="infinity" size={16} /> No meeting length cap</div>
          </div>
          <div className="ob-cell ob-cell--mini">
            <div className="ob-cell__title"><Icon name="history" size={16} /> Unlimited history</div>
          </div>
          <div className="ob-cell ob-cell--mini">
            <div className="ob-cell__title"><Icon name="terminal" size={16} /> Advanced MCP</div>
          </div>
          <div className="ob-cell ob-cell--wide">
            <div className="ob-cell__title">Workspace integrations &amp; API</div>
            <div className="ob-cell__desc">Integrate your meetings data with AI agents, CRMs, Slack, and more.</div>
            <div className="ob-cell__tag">HubSpot · Salesforce · Slack · API</div>
          </div>
        </div>
      </div>
      <div className="modal__foot trial-bento__foot">
        <button className="btn-v2 btn-v2--primary btn-v2--lg trial-bento__cta" onClick={onStart}>Start trial</button>
        <button className="trial-bento__self" onClick={onSelf}>Use Grain by myself</button>
      </div>
    </>
  );
}

// ── Enterprise edge: a paid workspace already exists on this domain ────────
export function ExistingOrgStep({ org, meetingCount, onRequest, onClose }: {
  org: { name: string; plan: string; members: number; admin: string }; meetingCount: number;
  onRequest?: () => void; onClose?: () => void;
}) {
  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <h2 className="modal__title">{`${org.name} already has a Grain workspace`}</h2>
          <p className="modal__sub">{`Your company is already on Grain ${org.plan}. To keep everyone's meetings in one place, request to join it instead of creating a second organization.`}</p>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close" /></button>
      </div>
      <div className="modal__body">
        <div className="xfer-party" style={{ padding: '4px 0 16px' }}>
          <div className="xfer-party__icon xfer-party__icon--org">
            <Icon name="briefcase" size={22} />
          </div>
          <div className="xfer-party__text">
            <div className="xfer-party__name">{org.name}</div>
            <div className="xfer-party__sub">{`Grain ${org.plan} · ${org.members} members · Admin: ${org.admin}`}</div>
          </div>
        </div>
        <div className="banner banner--neutral">
          <Icon name="info" size={16} />
          <span>{meetingCount > 0
            ? `If you're approved, your ${meetingCount} meetings move into ${org.name} with you. They will not be shared with anyone unless you share them.`
            : `If you're approved, you'll join ${org.name} as a member.`}</span>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--ghost btn--pill" onClick={onClose}><span className="btn-label">Cancel</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onRequest}>
          <span className="btn-label">{`Request to join ${org.name}`}</span>
        </button>
      </div>
    </>
  );
}

export function RequestSentStep({ org, onDone }: { org: { name: string; plan: string; admin: string }; onDone?: () => void }) {
  return (
    <>
      <div className="modal__body" style={{ padding: '36px 28px 8px' }}>
        <div className="success-block">
          <div className="success-block__mark"><Icon name="send" size={28} stroke={2} /></div>
          <div className="success-block__title">Request sent</div>
          <div className="success-block__sub">{`${org.name}'s admins will review your request. Until then, nothing changes; you keep using Grain on your own and your meetings stay yours.`}</div>
        </div>
        <div className="kv-list" style={{ padding: '20px 8px 0', borderTop: '1px solid var(--border)', marginTop: 22 }}>
          <div className="kv-row">
            <span className="kv-row__key">Workspace</span>
            <span className="kv-row__val">{`${org.name} · Grain ${org.plan}`}</span>
          </div>
          <div className="kv-row">
            <span className="kv-row__key">Reviewed by</span>
            <span className="kv-row__val">{org.admin}</span>
          </div>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--dark btn--pill btn--lg" onClick={onDone}>
          <span className="btn-label">Done</span>
        </button>
      </div>
    </>
  );
}

export function NameStep({ orgName, onName, onClose, onNext }: { orgName: string; onName: (v: string) => void; onClose?: () => void; onNext?: () => void }) {
  const valid = orgName.trim().length >= 2;
  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <h2 className="modal__title">Create your Grain organization</h2>
          <p className="modal__sub">Start a 14-day Grain Business trial. You'll be the admin.</p>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close" /></button>
      </div>
      <div className="modal__body">
        <div className="field">
          <label className="field__label">Organization name</label>
          <div className="field__input">
            <input value={orgName} onChange={(e) => onName(e.target.value)} autoFocus />
          </div>
          <span className="field__hint">Prefilled from your email domain. You can change it.</span>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--ghost btn--pill" onClick={onClose}><span className="btn-label">Cancel</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onNext} disabled={!valid}>
          <span className="btn-label">Continue</span>
        </button>
      </div>
    </>
  );
}

export function ExplainTransferStep({ orgName, meetingCount, userName, onBack, onCancel, onNext, onClose }: {
  orgName: string; meetingCount: number; userName: string;
  onBack?: () => void; onCancel?: () => void; onNext?: () => void; onClose?: () => void;
}) {
  const moveNote = `Your ${meetingCount} meetings move into ${orgName}, and ${orgName} owns them going forward.`;
  const accessNote = `They will not be shared with anyone unless you share them; existing sharing stays exactly as you set it.`;
  const settingsNote = `Your settings (capture preferences, integrations, templates) now apply inside ${orgName}.`;
  const oneWayNote = `This is one-way. There's no separate personal space afterward; if you ever leave ${orgName}, transferred meetings stay with the organization.`;

  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <h2 className="modal__title">{`Your meetings move into ${orgName}`}</h2>
          <p className="modal__sub">{`Creating ${orgName} brings your Grain account with you. Here's exactly what happens:`}</p>
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
            <div className="xfer-party__icon xfer-party__icon--org">
              <Icon name="briefcase" size={22} />
            </div>
            <div className="xfer-party__text">
              <div className="xfer-party__name">{orgName}</div>
              <div className="xfer-party__sub">Grain Business · you are the admin</div>
            </div>
          </div>
        </div>

        <p className="confirm-statement">Your past recordings move with you. They will not be shared with anyone unless you share them.</p>
        <ul className="bullets">
          <li>{moveNote}</li>
          <li>{accessNote}</li>
          <li>{settingsNote}</li>
          <li>{oneWayNote}</li>
        </ul>

        <div className="warn-callout warn-callout--info">
          <div className="warn-callout__icon"><Icon name="info" size={16} /></div>
          <div className="warn-callout__text">
            <span>{`Not ready? Choose "Don't create"; nothing changes, and you keep using Grain on your own.`}</span> <a href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
          </div>
        </div>
      </div>
      <div className="modal__foot modal__foot--split">
        <button className="btn btn--ghost btn--pill" onClick={onCancel || onBack}><span className="btn-label">Don't create</span></button>
        <div className="modal__foot-actions">
          <button className="btn btn--ghost btn--pill" onClick={onBack}><span className="btn-label">Back</span></button>
          <button className="btn btn--dark btn--pill btn--lg" onClick={onNext}>
            <span className="btn-label">{`Create ${orgName} & move my meetings`}</span>
          </button>
        </div>
      </div>
    </>
  );
}

export function CreatingStep({ orgName }: { orgName: string }) {
  return (
    <div className="modal__body" style={{ padding: '36px 24px 36px' }}>
      <div className="loading-block">
        <div className="spinner" />
        <div>
          <div className="loading-block__title">{`Creating ${orgName}…`}</div>
          <div className="loading-block__sub">{`Setting up ${orgName} and moving your meetings in.`}</div>
        </div>
      </div>
    </div>
  );
}

export function CreatorInviteStep({ orgName, peers, selected, onToggle, onSelectAll, onClear, onSkip, onNext, onClose }: {
  orgName: string; peers: Peer[]; selected: Set<string>;
  onToggle: (email: string) => void; onSelectAll: () => void; onClear: () => void;
  onSkip?: () => void; onNext?: () => void; onClose?: () => void;
}) {
  const [emailDraft, setEmailDraft] = useState('');
  const [extraEmails, setExtraEmails] = useState<string[]>([]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft.trim());
  const addEmail = () => {
    const v = emailDraft.trim().toLowerCase();
    if (!emailValid) return;
    if (!extraEmails.includes(v) && !peers.some((p) => p.email === v)) {
      setExtraEmails((list) => [...list, v]);
    }
    setEmailDraft('');
  };
  const removeEmail = (v: string) => setExtraEmails((list) => list.filter((e) => e !== v));

  const n = selected.size + extraEmails.length;
  const label = n === 0 ? 'Send invites' : `Send ${n} ${n === 1 ? 'invite' : 'invites'}`;

  const noSuggestions = peers.length === 0;
  const grainPeers = peers.filter((p) => p.onGrain);
  const calendarPeers = peers.filter((p) => !p.onGrain);
  const initialsOf = (name: string) => name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  const Row = (u: Peer) => (
    <div key={u.email} className={`user-row ${selected.has(u.email) ? 'is-checked' : ''}`} onClick={() => onToggle(u.email)}>
      {u.onGrain ? <Avatar name={u.name} /> : (
        <span className="user-row__avatar user-row__avatar--ghost" style={{ width: 36, height: 36, fontSize: 14 }}>{initialsOf(u.name)}</span>
      )}
      <div className="user-row__text">
        <div className="user-row__name">{u.name}</div>
        <div className="user-row__email">{u.email}</div>
        <div className="user-row__meta">
          {u.onGrain ? <><span className="presence-dot" />{u.lastSeen}</> : `On ${u.sharedMeetings} of your meetings`}
        </div>
      </div>
      <div className="user-row__check"><Icon name="check" size={14} stroke={3} /></div>
    </div>
  );

  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <h2 className="modal__title">{`Invite to ${orgName} organization`}</h2>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close" /></button>
      </div>
      <div className="modal__body">
        {noSuggestions && (
          <div className="invite-empty">
            <div className="invite-empty__icon"><Icon name="users" /></div>
            <div className="invite-empty__text">
              <p className="invite-empty__title">No teammates to suggest yet</p>
              <p className="invite-empty__desc">We couldn't find anyone else from your domain on Grain, and your recent meetings don't include colleagues to invite. Add teammates by email below to bring them into your organization.</p>
            </div>
          </div>
        )}
        <div className="field invite-email">
          <label className="field__label" htmlFor="invite-email-input">{noSuggestions ? 'Invite teammates by email' : 'Invite by email'}</label>
          <div className="field__input">
            <input
              id="invite-email-input"
              type="email"
              placeholder="Enter email address to invite"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEmail(); } }}
            />
            <button type="button" className="invite-email__add" onClick={addEmail} disabled={!emailValid}>Add</button>
          </div>
          {extraEmails.length > 0 && (
            <div className="invite-email__chips">
              {extraEmails.map((e) => (
                <span key={e} className="invite-chip">
                  {e}
                  <button type="button" className="invite-chip__x" aria-label={`Remove ${e}`} onClick={() => removeEmail(e)}>
                    <Icon name="close" size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {!noSuggestions && (
          <>
            <div className="list-head">
              <span className="list-head__count">{`${n} of ${peers.length} selected`}</span>
              {n === peers.length ? (
                <button className="list-head__link" onClick={onClear}>Clear all</button>
              ) : (
                <button className="list-head__link" onClick={onSelectAll}>Select all</button>
              )}
            </div>
            <div className="user-list">
              {grainPeers.length > 0 && (
                <div className="user-group">
                  <div className="user-group__head">
                    <span className="user-group__label">On Grain · {grainPeers.length}</span>
                  </div>
                  {grainPeers.map(Row)}
                </div>
              )}
              {calendarPeers.length > 0 && (
                <div className="user-group">
                  <div className="user-group__head">
                    <span className="user-group__label">From your calendar · {calendarPeers.length}</span>
                  </div>
                  {calendarPeers.map(Row)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--ghost btn--pill" onClick={onSkip}><span className="btn-label">Skip for now</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onNext} disabled={n === 0}>
          <span className="btn-label">{label}</span>
        </button>
      </div>
    </>
  );
}

export function SuccessStep({ orgName, onDone }: { orgName: string; onDone?: () => void }) {
  return (
    <>
      <div className="modal__body" style={{ padding: '36px 28px 8px' }}>
        <div className="success-block">
          <div className="success-block__mark"><Icon name="check" size={32} stroke={2.5} /></div>
          <div className="success-block__title">{`${orgName} is ready`}</div>
          <div className="success-block__sub">You're the admin. Your 14-day Grain Business trial has started.</div>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--dark btn--pill btn--lg" onClick={onDone}>
          <span className="btn-label">{`Open ${orgName}`}</span>
        </button>
      </div>
    </>
  );
}
