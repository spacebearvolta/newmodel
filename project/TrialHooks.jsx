// TrialHooks.jsx — Free-plan upgrade "hooks" for the solo persona.
//
// Each component is a moment where the free plan meets a limit and invites the
// user into a Grain Business trial. All built on the shared DS primitives
// (Modal, Icon, btn). CTAs call onStartTrial, which the host routes into the
// existing Upgrade flow.
//
//   H1  RecordingLimitModal  — 45-minute recording / upload cap (blocking modal)
//   H2  HistoryLockBanner    — meetings approaching the 30-day lock (ambient)
//   H3  LockedMeetingModal   — opening a meeting past the 30-day lock
//   H4/H5 TeamValueModal     — Invite / Share gated to a Business workspace
//
// Tone: helpful and clear, value-forward without the hard sell.

/* Shared value props — what a Business trial unlocks. Kept short so they can
   sit in a modal without turning into a pricing page. */
const HOOK_VALUE_POINTS = [
  { icon: 'infinity', label: 'No 45-minute recording cap' },
  { icon: 'history',  label: 'Unlimited meeting history' },
  { icon: 'users',    label: 'A shared library your whole team can search' },
  { icon: 'terminal', label: 'Integrations & API — HubSpot, Salesforce, Slack' },
];

function HookValueList({ points = HOOK_VALUE_POINTS }) {
  return (
    <ul className="hook-values">
      {points.map((p) => (
        <li key={p.label} className="hook-values__item">
          <span className="hook-values__icon"><Icon name={p.icon} size={15} /></span>
          <span>{p.label}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── H1 · 45-minute recording / upload wall ───────────────────────────────
   Blocking modal shown when a free user starts a capture or uploads a file
   that would run past the 45-minute cap. Matter-of-fact, not punitive. */
function RecordingLimitModal({ open, kind = 'record', onClose, onStartTrial }) {
  const isUpload = kind === 'upload';
  return (
    <Modal open={open} onClose={onClose} size="md">
      <button className="modal__close hook-modal__close" aria-label="Close" onClick={onClose}><Icon name="close" /></button>
      <div className="modal__body hook-modal">
        <div className="hook-modal__mark"><Icon name="clock" size={26} /></div>
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
        <button className="btn btn--ghost btn--pill" onClick={onClose}><span className="btn-label">Maybe later</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onStartTrial}>
          <span className="btn-label">Start free trial</span>
        </button>
      </div>
    </Modal>
  );
}

/* ── H2 · Meeting history approaching the 30-day lock ──────────────────────
   Ambient inline banner — a heads-up, not a blocker. Dismissible. Sits at the
   top of the meetings list. */
function HistoryLockBanner({ daysLeft = 5, onStartTrial, onDismiss }) {
  return (
    <div className="ms-history-banner" role="status">
      <span className="ms-history-banner__icon"><Icon name="history" size={17} /></span>
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

/* ── H3 · Locked meeting (past the 30-day window) ─────────────────────────
   Opened by clicking a locked meeting row instead of hitting an empty error.
   Explains the limit and offers the trial. */
function LockedMeetingModal({ meeting, onClose, onStartTrial }) {
  return (
    <Modal open={!!meeting} onClose={onClose} size="md">
      <button className="modal__close hook-modal__close" aria-label="Close" onClick={onClose}><Icon name="close" /></button>
      <div className="modal__body hook-modal">
        <div className="hook-modal__mark hook-modal__mark--locked"><Icon name="lock" size={24} /></div>
        <h2 className="hook-modal__title">This meeting is locked</h2>
        {meeting && (
          <div className="hook-locked-row">
            <span className="hook-locked-row__thumb"><Icon name="lock" size={15} /></span>
            <span className="hook-locked-row__text">
              <span className="hook-locked-row__name">{meeting.title}</span>
              <span className="hook-locked-row__meta">{meeting.date}</span>
            </span>
          </div>
        )}
        <p className="hook-modal__sub">
          It’s older than 30 days — past what the free plan keeps. Start a Business trial to unlock this meeting and keep every meeting you record, for good.
        </p>
      </div>
      <div className="modal__foot modal__foot--end hook-modal__foot">
        <button className="btn btn--ghost btn--pill" onClick={onClose}><span className="btn-label">Maybe later</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onStartTrial}>
          <span className="btn-label">Start free trial to unlock</span>
        </button>
      </div>
    </Modal>
  );
}

/* ── H4 / H5 · Team value-education modal (Invite & Share) ─────────────────
   Inviting and sharing are workspace functions. Rather than a bare form, lead
   with the outcome and a dimmed preview of what a team workspace looks like,
   then offer the trial. One component, parameterized by trigger. */
const TEAM_MODAL_COPY = {
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
  // Dimmed mockup suggesting a populated team meetings library.
  const rows = [[58, 32], [44, 26], [66, 38], [38, 22]];
  return (
    <div className="hook-preview" aria-hidden="true">
      <div className="hook-preview__bar">
        <span className="hook-preview__title"><Icon name="users" size={13} /> Team meetings</span>
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

function TeamValueModal({ trigger, onClose, onStartTrial }) {
  const copy = TEAM_MODAL_COPY[trigger] || TEAM_MODAL_COPY.invite;
  return (
    <Modal open={!!trigger} onClose={onClose} size="lg">
      <button className="modal__close hook-modal__close" aria-label="Close" onClick={onClose}><Icon name="close" /></button>
      <div className="modal__body hook-team">
        <div className="hook-team__copy">
          <div className="hook-team__eyebrow"><Icon name="sparkles" size={13} /> Grain Business · free for 14 days</div>
          <h2 className="hook-team__title">{copy.title}</h2>
          <p className="hook-team__sub">{copy.sub}</p>
          <HookValueList />
        </div>
        <div className="hook-team__visual">
          <TeamWorkspacePreview />
        </div>
      </div>
      <div className="modal__foot modal__foot--end hook-modal__foot">
        <button className="btn btn--ghost btn--pill" onClick={onClose}><span className="btn-label">Not now</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onStartTrial}>
          <span className="btn-label">{copy.cta}</span>
        </button>
      </div>
    </Modal>
  );
}

Object.assign(window, { RecordingLimitModal, HistoryLockBanner, LockedMeetingModal, TeamValueModal });

/* ═══ POST-TRIAL HOOKS (H7–H9) ═══════════════════════════════════════════ */

/* ── H7 · Trial expired — grace-state interstitial ────────────────────────
   Full-screen interstitial shown once on the first login after the trial
   ends. The workspace isn't deleted: its meetings sit in a grace window.
   Choose to reactivate (Upgrade) or continue on a free account. After this,
   only the persistent ExpiredBar remains (with a deletion countdown). */
function TrialExpiredInterstitial({ open, orgName = 'your organization', graceDays = 30, onUpgrade, onContinueFree }) {
  return (
    <Modal open={open} dismissible={false} size="xl">
      <div className="modal__body trial-expired">
        <span className="trial-expired__mark"><Icon name="clock" size={26} /></span>
        <h2 className="trial-expired__title">Your Grain Business trial has ended</h2>
        <p className="trial-expired__sub">
          Nothing’s gone. {orgName}’s shared meetings are saved for {graceDays} days — reactivate to switch your workspace back on and keep everything, or continue on a free account.
        </p>
        <div className="trial-expired__grace">
          <span className="trial-expired__graceIcon"><Icon name="shield" size={16} /></span>
          <div className="trial-expired__graceText">
            <div className="trial-expired__graceTitle">Saved for {graceDays} days</div>
            <div className="trial-expired__graceSub">Your organization’s meeting history stays recoverable during this window. We’ll remind you before anything is removed.</div>
          </div>
        </div>
        <ul className="hook-values trial-expired__values">
          <li className="hook-values__item"><span className="hook-values__icon"><Icon name="infinity" size={15} /></span><span>No 45-minute recording cap</span></li>
          <li className="hook-values__item"><span className="hook-values__icon"><Icon name="history" size={15} /></span><span>Unlimited meeting history</span></li>
          <li className="hook-values__item"><span className="hook-values__icon"><Icon name="users" size={15} /></span><span>Your team’s shared meeting library, back on</span></li>
        </ul>
      </div>
      <div className="modal__foot modal__foot--end hook-modal__foot">
        <button className="btn btn--pill" onClick={onContinueFree}><span className="btn-label">Continue with free account</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onUpgrade}><span className="btn-label">Upgrade now</span></button>
      </div>
    </Modal>
  );
}

/* ── H8 · Feature-usage nudge (contextual, mid-trial) ─────────────────────
   A subtle, non-blocking chip tied to a Business-only feature the user just
   reached during the trial. Dismissible. (Toast variant is handled by the
   host's existing <Toast>.) */
function FeatureNudgeChip({ feature, daysLeft, onDismiss }) {
  return (
    <div className="feature-nudge" role="status">
      <span className="feature-nudge__icon"><Icon name="sparkles" size={13} /></span>
      <span className="feature-nudge__text">
        <strong>{feature}</strong> is a Grain Business feature{daysLeft != null ? ` · ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your trial` : ''}
      </span>
      {onDismiss && (
        <button className="feature-nudge__close" aria-label="Dismiss" onClick={onDismiss}><Icon name="close" size={13} /></button>
      )}
    </div>
  );
}

/* ── H9 · Teammate engagement nudge ───────────────────────────────────────
   In-app notification to the trial owner the moment a teammate's first
   meeting is captured — proof the trial is delivering. Bottom-right card. */
function TeammateNudge({ name = 'Maya Chen', daysLeft, onView, onClose }) {
  const first = name.split(' ')[0];
  return (
    <div className="teammate-nudge" role="status">
      <button className="teammate-nudge__close" aria-label="Dismiss" onClick={onClose}><Icon name="close" size={14} /></button>
      <div className="teammate-nudge__head">
        <Avatar name={name} size={38} />
        <div className="teammate-nudge__headtext">
          <span className="teammate-nudge__eyebrow"><Icon name="sparkles" size={12} /> Your trial is working</span>
          <span className="teammate-nudge__title">{first} just captured their first meeting</span>
        </div>
      </div>
      <p className="teammate-nudge__body">
        {first}’s meeting just landed in your workspace — that’s shared context your whole team can search and build on. Keep it going{daysLeft != null ? ` · ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your trial` : ''}.
      </p>
      <div className="teammate-nudge__actions">
        <button className="btn btn--ghost btn--pill" onClick={onClose}><span className="btn-label">Dismiss</span></button>
        <button className="btn btn--dark btn--pill" onClick={onView}><span className="btn-label">See the meeting</span></button>
      </div>
    </div>
  );
}

Object.assign(window, { TrialExpiredInterstitial, FeatureNudgeChip, TeammateNudge });
