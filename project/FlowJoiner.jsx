// flow2.jsx — Org joiner persona
//
// Flow: home shows invite (promo card + Updates badge) → click → invite modal
// 1. Invite detail (review / don't join).
// 2. The move, explained: your settings apply inside the org and your
//    meetings move with you.
// 3. Decision (binary): join with your meetings, or don't join. No archive
//    path — there is no third option.
// 4. Joining…
// 5. Done → lands on My meetings inside the new workspace with an explicit
//    "what moved, who can see it" marker.

const { useState: useS2, useEffect: useE2, useMemo: useM2 } = React;

const JOINER_USER = {
  name: 'Jeff Whitlock',
  email: 'jeff@acme.com',
  domain: 'acme.com',
};

const INVITE = {
  orgName: 'Acme',
  orgSlug: 'acme',
  inviterName: 'Priya Sundaram',
  inviterEmail: 'priya@acme.com',
  inviterRole: 'Organization admin',
  inviteDate: 'Today',
  memberCount: 12,
};

// Personal meetings captured before joining. When present, joining routes
// through the transfer explanation + "what about your existing meetings"
// choice. Toggle via the `hasMeetings` prop / Tweak.
const JOINER_MEETINGS = [
  { id: 'jm1', title: 'Weekly 1:1 — Maya Chen',       attendees: '2 people', duration: '31 min', date: 'May 28' },
  { id: 'jm2', title: 'Acme × Northwind — Discovery', attendees: '5 people', duration: '48 min', date: 'May 27' },
  { id: 'jm3', title: 'Product roadmap sync',         attendees: '7 people', duration: '52 min', date: 'May 23' },
  { id: 'jm4', title: 'Beacon onboarding kickoff',    attendees: '4 people', duration: '39 min', date: 'May 21' },
  { id: 'jm5', title: 'Design review — Q3 dashboard',  attendees: '6 people', duration: '44 min', date: 'May 19' },
  { id: 'jm6', title: 'Sales pipeline review',        attendees: '5 people', duration: '36 min', date: 'May 16' },
];

function JoinOrgApp({ onSettings, hasMeetings = true, inOrg = false }) {
  const meetings = hasMeetings ? JOINER_MEETINGS : [];
  const meetingCount = hasMeetings ? MS_MY_MEETING_COUNT : 0;
  const [step, setStep] = useS2(null);
  // 'invite' | 'explain' | 'decision' | 'joining' | 'joined'
  const [choice, setChoice] = useS2(null);
  const [downloadProgress, setDownloadProgress] = useS2(0);
  // The "Part of org" tweak (inOrg) pins the joiner as an existing member of
  // the org — steady state, no invite machinery. With it off, the joiner is
  // someone who hasn't joined yet and can walk the invite flow interactively.
  const [joined, setJoined] = useS2(inOrg);
  const [declined, setDeclined] = useS2(false);
  const [upgradeOpen, setUpgradeOpen] = useS2(false);
  const [landingSeen, setLandingSeen] = useS2(inOrg);
  const [toast, setToast] = useS2(null);

  // Keep the flow in sync when the tweak flips after mount.
  useE2(() => {
    setJoined(inOrg);
    setDeclined(false);
    setStep(null);
    setChoice(null);
    setDownloadProgress(0);
    setLandingSeen(inOrg); // tweak-driven membership is steady state — no "you're in" banner
  }, [inOrg]);

  const reset = () => {
    // Full restart of the prototype — clear org + onboarding state and
    // send the user back to the sign-up screen.
    try {
      localStorage.removeItem('grain.onboarded');
      localStorage.removeItem('grain.orgCreated');
      localStorage.removeItem('grain.orgName');
      localStorage.removeItem('grain.trialSeen');
    } catch (e) {/* ignore */}
    window.location.href = 'Onboarding.html';
  };

  const open = () => { setChoice(null); setStep('invite'); };
  const close = () => setStep(null);

  const accept = () => { if (meetingCount === 0) { finalizeJoin(); } else { setStep('explain'); } };

  const decline = () => { setDeclined(true); setStep(null); };

  const finalizeJoin = () => {
    // Joining is the move: settings apply inside the org, meetings move in.
    setChoice('transfer');
    setStep('joining');
    setTimeout(() => { setJoined(true); setStep('joined'); }, 1500);
  };

  const updatesBadge = !joined && !declined ? '1' : null;

  const promoCard = joined
    ? (inOrg ? null : <JoinedPromoCard orgName={INVITE.orgName}/>)
    : declined
      ? <DeclinedPromoCard/>
      : <InvitePromoCard onView={open}/>;

  return (
    <div className="app">
      <Sidebar
        user={JOINER_USER}
        orgName={joined ? INVITE.orgName : 'Personal'}
        hasOrg={joined}
        isAdmin={false}
        onSettings={onSettings}
        onUpgrade={() => setUpgradeOpen(true)}
        updatesBadge={updatesBadge}
        onUpdatesClick={() => !joined && !declined && open()}
        promoCard={promoCard}/>
      <main className="canvas">
        {joined ? (
          <MeetingsSurface
            key="joined"
            mode="org"
            orgName={INVITE.orgName}
            hasMeetings={hasMeetings}
            initialView="mine"
            onUpgrade={() => setUpgradeOpen(true)} />
        ) : (
          <MeetingsSurface
            key="solo"
            mode="solo"
            hasMeetings={hasMeetings}
            onStartTrial={declined ? () => setUpgradeOpen(true) : open}
            gate={declined ? undefined : {
              title: `Join ${INVITE.orgName} to see shared meetings`,
              desc: `All meetings is ${INVITE.orgName}’s shared library — every meeting teammates share to a team shows up here. Your invite from ${INVITE.inviterName.split(' ')[0]} includes access.`,
              cta: `View your invite to ${INVITE.orgName}`,
              note: `${INVITE.memberCount} teammates already share meeting context`,
            }}
            onUpgrade={() => setUpgradeOpen(true)} />
        )}
      </main>

      <Modal open={step !== null} onClose={close} size="md">
        {step === 'invite' && (
          <InviteStep
            meetingCount={meetingCount}
            onAccept={accept}
            onDecline={decline}
            onClose={close}/>
        )}
        {step === 'explain' && (
          <JExplainTransferStep
            orgName={INVITE.orgName}
            meetingCount={meetingCount}
            inviterName={INVITE.inviterName}
            onBack={() => setStep('invite')}
            onNext={() => setStep('decision')}
            onClose={close}/>
        )}
        {step === 'decision' && (
          <DecisionStep
            choice={choice}
            onChoice={setChoice}
            meetingCount={meetingCount}
            onBack={() => setStep('explain')}
            onClose={close}
            onNext={() => (choice === 'join' ? finalizeJoin() : decline())}/>
        )}
        {step === 'joining' && (
          <JoiningStep orgName={INVITE.orgName} choice={choice}/>
        )}
        {step === 'joined' && (
          <JoinedStep
            orgName={INVITE.orgName}
            choice={choice}
            meetingCount={meetingCount}
            onDone={close}/>
        )}
      </Modal>

      <UpgradePlanModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} showTrialBadge={false} />
      {toast && <Toast>{toast}</Toast>}
      <Replay onClick={reset} label="Reset prototype"/>
    </div>
  );
}

/* ─── Promo cards ───────────────────────────────────────────────────── */

function InvitePromoCard({ onView }) {
  return (
    <div className="card card--invite is-clickable" onClick={onView}>
      <div className="invite-card__hero">
        <div className="invite-card__avatars">
          <Avatar name={INVITE.inviterName} size={32}/>
          <span className="invite-card__plus">+</span>
          <div className="invite-card__org-mark"><Icon name="briefcase" size={15}/></div>
        </div>
      </div>
      <span className="card__pill invite-card__pill"><Icon name="users" size={10}/> Organization invite</span>
      <p className="card__title">{`Join ${INVITE.orgName}`}</p>
      <p className="card__desc">{`${INVITE.inviterName.split(' ')[0]} invited you. ${INVITE.memberCount} teammates already share meeting context.`}</p>
      <div className="card__actions">
        <button className="card__cta card__cta--green" onClick={(e) => { e.stopPropagation(); onView(); }}>
          <span className="btn-label">Review invite</span>
        </button>
      </div>
    </div>
  );
}

function JoinedPromoCard({ orgName }) {
  return (
    <div className="card">
      <div className="card__thumb" style={{background:'linear-gradient(135deg, #E6F7EE 0%, #C3ECD5 100%)', textAlign:'center', padding:'18px 14px'}}>
        <Icon name="check" size={24} stroke={2.5} style={{color:'#0B6F3F'}}/>
      </div>
      <p className="card__title">{`You're in ${orgName}`}</p>
      <p className="card__desc">Find shared meetings in the organization library.</p>
    </div>
  );
}

function DeclinedPromoCard() {
  return (
    <div className="card">
      <div className="card__thumb">
        <div className="card__line"/>
        <div className="card__line"/>
        <div className="card__line"/>
      </div>
      <p className="card__title">Keep using Grain personally</p>
      <p className="card__desc">You declined the invite. Your account stays personal.</p>
    </div>
  );
}

/* ─── Steps ─────────────────────────────────────────────────────────── */

function InviteStep({ meetingCount = 6, onAccept, onDecline, onClose }) {
  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <div className="modal__eyebrow"><Icon name="users" size={11}/> Organization invite</div>
          <h2 className="modal__title">{`${INVITE.inviterName.split(' ')[0]} invited you to join ${INVITE.orgName}`}</h2>
          <p className="modal__sub">{`${INVITE.memberCount} teammates already share meeting context in this organization.`}</p>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close"/></button>
      </div>
      <div className="modal__body">
        <div className="row" style={{padding: '4px 0 18px', alignItems: 'center'}}>
          <Avatar name={INVITE.inviterName} size={44}/>
          <div style={{flex:1}}>
            <div style={{fontSize: 14, fontWeight: 600, color: 'var(--fg-1)'}}>{INVITE.inviterName}</div>
            <div style={{fontSize: 12.5, color: 'var(--fg-5)'}}>{`${INVITE.inviterEmail} · ${INVITE.inviterRole}`}</div>
          </div>
        </div>

        <div className="kv-list" style={{paddingTop: 14, borderTop: '1px solid var(--border)'}}>
          <div className="kv-row">
            <span className="kv-row__key">Organization</span>
            <span className="kv-row__val"><strong style={{fontWeight: 600}}>{INVITE.orgName}</strong></span>
          </div>
          <div className="kv-row">
            <span className="kv-row__key">Your role</span>
            <span className="kv-row__val">Member</span>
          </div>
          <div className="kv-row">
            <span className="kv-row__key">Sent</span>
            <span className="kv-row__val">{INVITE.inviteDate}</span>
          </div>
        </div>
      </div>
      <div className="modal__foot modal__foot--split">
        <button className="btn btn--ghost btn--pill" onClick={onDecline}><span className="btn-label">Don't join</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onAccept}>
          <span className="btn-label">Accept invite</span>
        </button>
      </div>
    </>
  );
}

/* The decision — binary. Join with your meetings, or don't join.
   No archive path; there is no third option. */
function DecisionStep({ choice, onChoice, meetingCount = 6, onBack, onClose, onNext }) {
  const nextLabel = choice === 'join'
    ? `Join ${INVITE.orgName} & move my meetings`
    : choice === 'decline'
      ? 'Decline invite'
      : 'Continue';
  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <h2 className="modal__title">{`Join ${INVITE.orgName} with your meetings?`}</h2>
          <p className="modal__sub">{`Joining moves your ${meetingCount} meetings into ${INVITE.orgName} — there's no way to join without them.`}</p>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close"/></button>
      </div>
      <div className="modal__body modal__body--tight">
        <div className="choices">
          <button className={`choice ${choice === 'join' ? 'is-selected' : ''}`} onClick={() => onChoice('join')}>
            <div className="choice__line-icon"><Icon name="swap" size={20}/></div>
            <div className="choice__text">
              <div className="choice__title">Join — move my meetings</div>
              <div className="choice__desc">{`All ${meetingCount} meetings move into ${INVITE.orgName}, and ${INVITE.orgName} owns them going forward. They will not be shared with anyone unless you share them.`}</div>
            </div>
            <span className="choice__radio"><Icon name="check" size={12} stroke={3}/></span>
          </button>
          <button className={`choice ${choice === 'decline' ? 'is-selected' : ''}`} onClick={() => onChoice('decline')}>
            <div className="choice__line-icon"><Icon name="close" size={20}/></div>
            <div className="choice__text">
              <div className="choice__title">Don't join</div>
              <div className="choice__desc">Decline the invite. Nothing changes — you keep using Grain on your own, and your meetings stay where they are.</div>
            </div>
            <span className="choice__radio"><Icon name="check" size={12} stroke={3}/></span>
          </button>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--ghost btn--pill" onClick={onBack}><span className="btn-label">Back</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onNext} disabled={!choice}>
          <span className="btn-label">{nextLabel}</span>
        </button>
      </div>
    </>
  );
}

function JExplainTransferStep({ orgName, meetingCount, inviterName, onBack, onNext, onClose }) {
  // Two-part move, stated plainly. The choice is binary: join with your
  // meetings, or don't join. No archive path.
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
          <p className="modal__sub">{`Two things happen when you join. You'll decide next — here's exactly what they are:`}</p>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close"/></button>
      </div>
      <div className="modal__body modal__body--tight">
        <div className="xfer-visual">
          <div className="xfer-party">
            <Avatar name={JOINER_USER.name} size={44}/>
            <div className="xfer-party__text">
              <div className="xfer-party__name">{JOINER_USER.name}</div>
              <div className="xfer-party__sub">{`${meetingCount} meetings · your settings`}</div>
            </div>
          </div>
          <div className="xfer-arrow"><Icon name="arrowDown" size={16}/></div>
          <div className="xfer-party">
            <div className="xfer-party__icon xfer-party__icon--org">
              <Icon name="briefcase" size={22}/>
            </div>
            <div className="xfer-party__text">
              <div className="xfer-party__name">{orgName}</div>
              <div className="xfer-party__sub">{`Organization · invited by ${inviterName}`}</div>
            </div>
          </div>
        </div>

        <p className="confirm-statement">Your past recordings move with you. They will not be shared with anyone unless you share them.</p>
        <ul className="bullets">
          {lines.map((l, i) => <li key={i}>{l}</li>)}
        </ul>

        <div className="warn-callout warn-callout--info">
          <div className="warn-callout__icon"><Icon name="info" size={16}/></div>
          <div className="warn-callout__text">
            {`Not ready? You can decline — nothing changes, and you keep using Grain on your own.`} <a href="#">Learn more</a>
          </div>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--ghost btn--pill" onClick={onBack}><span className="btn-label">Back</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onNext}>
          <span className="btn-label">Continue</span>
        </button>
      </div>
    </>
  );
}

function JoiningStep({ orgName, choice }) {
  const sub = `Moving your meetings into ${orgName}.`;
  return (
    <div className="modal__body" style={{padding: '36px 24px 36px'}}>
      <div className="loading-block">
        <div className="spinner"/>
        <div>
          <div className="loading-block__title">{`Joining ${orgName}…`}</div>
          <div className="loading-block__sub">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function JoinedStep({ orgName, choice, meetingCount, onDone }) {
  const summary = meetingCount > 0
    ? `Your ${meetingCount} meetings moved with you — they're not shared with anyone unless you share them.`
    : `You're a member. New meetings you capture are owned by ${orgName}.`;
  return (
    <>
      <div className="modal__body" style={{padding: '36px 28px 8px'}}>
        <div className="success-block">
          <div className="success-block__mark"><Icon name="check" size={32} stroke={2.5}/></div>
          <div className="success-block__title">{`You're in ${orgName}`}</div>
          <div className="success-block__sub">{summary}</div>
        </div>
        <div className="kv-list" style={{padding: '20px 8px 0', borderTop: '1px solid var(--border)', marginTop: 22}}>
          <div className="kv-row">
            <span className="kv-row__key">Organization</span>
            <span className="kv-row__val">{`${orgName} · ${INVITE.memberCount + 1} members`}</span>
          </div>
          <div className="kv-row">
            <span className="kv-row__key">Your role</span>
            <span className="kv-row__val">Member</span>
          </div>
          <div className="kv-row">
            <span className="kv-row__key">Invited by</span>
            <span className="kv-row__val">{INVITE.inviterName}</span>
          </div>
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

Object.assign(window, { JoinOrgApp });
