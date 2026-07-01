// flow1.jsx — Org creator / trial starter persona
//
// Flow: home → entry point (dropdown OR promo card) → create modal
// 1. Name your Grain org (prefilled from email domain)
// 2. What about your existing meetings? — 3-way choice
//    (transfer to org / download transcripts, then delete / delete)
// 3. Confirm transfer OR confirm delete OR (download progress)
// 4. Creating
// 5. Invite same-domain teammates (fixed 5 users)
// 6. Done
//
// No stepper, no slug field, no Tweaks for meeting/peer counts.

const { useState: useS1, useEffect: useE1, useMemo: useM1 } = React;

const USER = {
  name: 'Jeff Whitlock',
  email: 'jeff@acme.com',
  domain: 'acme.com'
};

const DOMAIN_PEERS = [
// Existing Grain users on this domain — show recent activity ("last seen").
{ name: 'Maya Chen', email: 'maya@acme.com', onGrain: true, lastSeen: 'Active today' },
{ name: 'Devon Rao', email: 'devon@acme.com', onGrain: true, lastSeen: 'Active 2 days ago' },
{ name: 'Priya Sundaram', email: 'priya@acme.com', onGrain: true, lastSeen: 'Active 3 weeks ago' },
// Not on Grain — surfaced from acme.com participants on your calendar meetings.
{ name: 'Sam Okafor', email: 'sam@acme.com', onGrain: false, sharedMeetings: 6 },
{ name: 'Alex Beckett', email: 'alex@acme.com', onGrain: false, sharedMeetings: 2 }];

// Enterprise edge: a paid workspace already exists on this domain. The flow
// then offers "request to join" instead of creating a second organization.
const EXISTING_PAID_ORG = {
  name: 'Acme', plan: 'Business', members: 24, admin: 'Priya Sundaram'
};


// Personal meetings captured before the org exists. When present, creating an
// org routes through the "What about your existing meetings?" choice
// (transfer / download+delete / delete). An empty list skips straight to
// creating (brand-new account). Toggle via the `hasMeetings` prop / Tweak.
const PERSONAL_MEETINGS = [
{ id: 'm1', title: 'Weekly 1:1 — Maya Chen', attendees: '2 people', duration: '31 min', date: 'May 28' },
{ id: 'm2', title: 'Acme × Northwind — Discovery', attendees: '5 people', duration: '48 min', date: 'May 27' },
{ id: 'm3', title: 'Product roadmap sync', attendees: '7 people', duration: '52 min', date: 'May 23' },
{ id: 'm4', title: 'Beacon onboarding kickoff', attendees: '4 people', duration: '39 min', date: 'May 21' },
{ id: 'm5', title: 'Design review — Q3 dashboard', attendees: '6 people', duration: '44 min', date: 'May 19' },
{ id: 'm6', title: 'Sales pipeline review', attendees: '5 people', duration: '36 min', date: 'May 16' }];



// Derive the default org name from the email domain.
// acme.com → "Acme"; acme-co.io → "Acme Co"
function orgNameFromDomain(domain) {
  const base = (domain || '').split('.')[0] || '';
  return base.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

/* ── Post-first-meeting Claude / MCP connector ────────────────────────
   Banner near the top of the meetings surface + the external-handoff modal
   its CTA opens. Connecting finishes in Claude, not inside Grain. */
function ClaudeMeetingBanner({ onConnect, onDismiss }) {
  return (
    <div className="ms-claude-banner" role="region" aria-label="Connect Grain to Claude">
      <span className="ms-claude-banner__icon"><img src="assets/claude-icon.png" alt="Claude" /></span>
      <div className="ms-claude-banner__text">
        <div className="ms-claude-banner__title">Put your first meeting to work in Claude</div>
        <div className="ms-claude-banner__body" data-comment-anchor="2f223ecbc8-div-68-9">Connect Grain to Claude to ask questions, draft follow-ups, and use your meetings as context in your AI workflows.</div>
      </div>
      <div className="ms-claude-banner__actions">
        <button className="btn btn--dark btn--pill" onClick={onConnect}><span className="btn-label">Connect in Claude</span></button>
        <button className="btn btn--ghost btn--pill" onClick={onDismiss}><span className="btn-label">Dismiss</span></button>
      </div>
    </div>);

}

function ClaudeHandoff({ onReturn }) {
  return (
    <>
      <div className="modal__body" style={{ padding: '36px 28px 8px' }}>
        <div className="success-block">
          <div className="success-block__mark" style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--fg-2)' }}>
            <Icon name="ext" size={28} />
          </div>
          <div className="success-block__title">Finish connecting in Claude</div>
          <div className="success-block__sub">Claude will open in your browser to finish connecting Grain. Once you’re done there, come back — your meeting context will be available in Claude.</div>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--dark btn--pill btn--lg" onClick={onReturn}><span className="btn-label">Return to Grain</span></button>
      </div>
    </>);

}

function StartTrialApp({ onSettings, trialDays = TRIAL_TOTAL, hasMeetings = true, trialOver = false, paidOrgOnDomain = false, showClaudeBanner = false, emptyDomain = false, graceDays = 30, teammateNudge = false }) {
  const meetings = hasMeetings ? PERSONAL_MEETINGS : [];
  const meetingCount = hasMeetings ? MS_MY_MEETING_COUNT : 0;
  // Gmail / personal-domain creators (or domains with no other Grain users and
  // no same-domain meeting participants) have nobody to suggest.
  const invitePeers = emptyDomain ? [] : DOMAIN_PEERS;
  const [step, setStep] = useS1(null);
  // 'name' | 'explain' | 'creating' | 'invite' | 'done' | 'existing' | 'requested'
  const [orgName, setOrgName] = useS1(() => {
    try {return localStorage.getItem('grain.orgName') || orgNameFromDomain(USER.domain);}
    catch (e) {return orgNameFromDomain(USER.domain);}
  });
  const [choice, setChoice] = useS1(null); // 'transfer' | 'download' | 'delete'
  const [selectedInvites, setSelectedInvites] = useS1(new Set());
  const [downloadProgress, setDownloadProgress] = useS1(0);
  const [orgCreated, setOrgCreated] = useS1(() => {
    try {return localStorage.getItem('grain.orgCreated') === '1';} catch (e) {return false;}
  });
  const [promoDismissed, setPromoDismissed] = useS1(false);
  const [barDismissed, setBarDismissed] = useS1(false);
  const [endedCardDismissed, setEndedCardDismissed] = useS1(false);
  const [upgradeOpen, setUpgradeOpen] = useS1(false);
  const [checkoutOpen, setCheckoutOpen] = useS1(false);
  const [toast, setToast] = useS1(null);
  const [activeView, setActiveView] = useS1('mine');
  // Free-plan upgrade hooks (solo persona). null when closed.
  const [recordLimit, setRecordLimit] = useS1(null);   // null | 'record' | 'upload'  (H1)
  const [historyDismissed, setHistoryDismissed] = useS1(false); // H2 (session)
  const [lockedMeeting, setLockedMeeting] = useS1(null); // meeting | null (H3)
  const [teamValue, setTeamValue] = useS1(null);       // null | 'invite' | 'share' (H4/H5)
  // Post-trial hooks (H7–H9)
  const [expiryDismissed, setExpiryDismissed] = useS1(false);   // H7 interstitial (per login)
  const [teammateDismissed, setTeammateDismissed] = useS1(false); // H9
  const [teammateAuto, setTeammateAuto] = useS1(false);          // H9 auto-fire
  // Post-first-meeting Claude/MCP banner — optional accelerator, dismissible.
  // "Connect in Claude" is an external handoff, never in-app auth.
  const [claudeDismissed, setClaudeDismissed] = useS1(false);
  const [claudeHandoff, setClaudeHandoff] = useS1(false);

  // Trial countdown popup. Opens only when the user explicitly clicks the
  // trial pill in the header or the “Upgrade now” widget in the sidebar —
  // we no longer auto-nag with it right after the workspace is created.
  const [trialPopupDay, setTrialPopupDay] = useS1(null);
  const [trialSeen, setTrialSeen] = useS1(() => {
    try {return new Set(JSON.parse(localStorage.getItem('grain.trialSeen') || '[]'));}
    catch (e) {return new Set();}
  });
  const closeTrial = () => {
    setTrialPopupDay(null);
    setTrialSeen((prev) => {
      const next = new Set(prev);next.add(trialDays);
      try {localStorage.setItem('grain.trialSeen', JSON.stringify([...next]));} catch (e) {}
      return next;
    });
  };

  // Persist org state so a created workspace survives navigation to the
  // Settings / Org admin areas and back.
  const persistOrg = (created, name) => {
    try {
      if (created) {
        localStorage.setItem('grain.orgCreated', '1');
        localStorage.setItem('grain.orgName', name || orgName);
      } else {
        localStorage.removeItem('grain.orgCreated');
        localStorage.removeItem('grain.orgName');
      }
    } catch (e) {/* ignore */}
  };

  const goOrgAdmin = () => {window.location.href = 'Org Admin.html';};

  const reset = () => {
    // Full restart of the prototype — clear org + onboarding state and
    // send the user back through the first-run flow.
    persistOrg(false);
    try {localStorage.removeItem('grain.onboarded');} catch (e) {/* ignore */}
    try {localStorage.removeItem('grain.trialSeen');} catch (e) {/* ignore */}
    window.location.href = 'Onboarding.html';
  };

  const _resetInPlace = () => {
    setOrgCreated(false);
    persistOrg(false);
    setPromoDismissed(false);
    setStep(null);
    setTrialPopupDay(null);
    setTrialSeen(new Set());
    try {localStorage.removeItem('grain.trialSeen');} catch (e) {/* ignore */}
    setOrgName(orgNameFromDomain(USER.domain));
    setChoice(null);
    setSelectedInvites(new Set());
    setDownloadProgress(0);
  };

  const start = () => {
    setOrgName(orgNameFromDomain(USER.domain));
    setChoice(null);
    setSelectedInvites(new Set());
    // Enterprise edge: a paid workspace already exists on this domain — that's
    // a join request, not a trial start, so skip the trial bento.
    // Every other "Start trial" entry point (sidebar promo, workspace
    // switcher) opens on the same trial bento shown in first-run setup, then
    // continues into org creation — keeping the two flows consistent.
    setStep(paidOrgOnDomain ? 'existing' : 'trial');
  };

  // From the trial bento: "Start trial" continues into org creation.
  const startFromBento = () => setStep('name');

  const close = () => setStep(null);

  const finalizeCreate = () => {
    // Creating an org is a one-way move: your meetings come with you.
    setChoice('transfer');
    setStep('creating');
    setTimeout(() => {
      // Stay in the modal: 'creating' → 'invite' (creator picks teammates) → 'done'.
      // Don't flip orgCreated until the SuccessStep closes — otherwise the home
      // behind the modal jumps to a post-state while the user is still inside
      // the invite step.
      setStep('invite');
    }, 1500);
  };

  const toggleInvite = (email) => {
    setSelectedInvites((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);else next.add(email);
      return next;
    });
  };

  const sendInvites = () => {
    if (selectedInvites.size > 0) {
      const n = selectedInvites.size;
      setToast(`${n} invite${n === 1 ? '' : 's'} sent`);
      setTimeout(() => setToast(null), 2200);
    }
    setStep('done');
  };

  // Trial-over (tweak): the workspace tombstones — it never ejects anyone and
  // the user never "goes back" to a personal account. Meetings the user
  // recorded or joined stay fully accessible; meetings shared by others lock
  // until the workspace is active again. Only applies once an organization
  // exists — a fresh single player (e.g. straight out of onboarding) can
  // never be in an expired state.
  // The tweak itself implies an organization was created — force the
  // post-creation state so flipping "Trial over" always shows the expired
  // workspace, even when the creation flow wasn't walked first this session.
  const orgExists = orgCreated || trialOver;
  const orgInactive = trialOver;
  const orgActive = orgExists && !orgInactive;
  // Reactivation has a single real plan choice (Grain Business), so skip the
  // plan picker and route straight to checkout.
  const openReactivate = () => setCheckoutOpen(true);
  const talkToSales = () => {
    setUpgradeOpen(false);
    setCheckoutOpen(false);
    setToast('Thanks — our team will reach out about reactivating your trial.');
    setTimeout(() => setToast(null), 2600);
  };
  const completeReactivation = () => {
    setCheckoutOpen(false);
    setToast(`Payment received — ${orgName} is active again.`);
    setTimeout(() => setToast(null), 2800);
  };

  // H8 — contextual nudge when a Business-only feature is used mid-trial.
  const FEATURE_LABELS = { share: 'Sharing to a team', ai: 'AI actions on shared meetings', integration: 'Workspace integrations' };
  const onFeatureUse = (f) => {
    const label = FEATURE_LABELS[f] || 'This';
    setToast(`${label} is a Grain Business feature — ${trialDays} ${trialDays === 1 ? 'day' : 'days'} left in your trial.`);
    setTimeout(() => setToast(null), 3400);
  };

  // H9 — auto-fire the teammate-engagement nudge shortly after landing in an
  // active-trial workspace (once per login). The tweak can also force it.
  useE1(() => {
    if (!orgActive || teammateAuto || teammateDismissed) return undefined;
    const id = setTimeout(() => setTeammateAuto(true), 2500);
    return () => clearTimeout(id);
  }, [orgActive, teammateAuto, teammateDismissed]);
  // Toggling the tweak on re-arms the nudge even after a dismiss.
  useE1(() => { if (teammateNudge) setTeammateDismissed(false); }, [teammateNudge]);

  // H7 — the sidebar trial-ended widget (TrialEndedCard) carries the expired
  // state; a separate top banner was redundant, so the meetings surface shows
  // no expired bar.
  const showTeammateNudge = orgActive && (teammateNudge || teammateAuto) && !teammateDismissed;

  const claudeBanner = showClaudeBanner && !claudeDismissed ?
  <ClaudeMeetingBanner onConnect={() => setClaudeHandoff(true)} onDismiss={() => setClaudeDismissed(true)} /> :
  null;

  // H2 — ambient "meetings approaching the 30-day lock" heads-up. Free/solo
  // with existing meetings; dismissible for the session. The existing
  // onUpgrade (→ Upgrade flow) doubles as the trial entry point.
  const launchTrial = () => setUpgradeOpen(true);
  const historyBanner = (!orgExists && hasMeetings && !historyDismissed) ?
  <HistoryLockBanner daysLeft={5} onStartTrial={launchTrial} onDismiss={() => setHistoryDismissed(true)} /> :
  null;

  return (
    <div className="app">
      <Sidebar
        user={USER}
        orgName={orgExists ? orgName : 'Personal'}
        hasOrg={orgExists}
        adminPaused={orgInactive}
        onSettings={onSettings}
        onOrgAdmin={orgActive ? goOrgAdmin : orgInactive ? openReactivate : start}
        onUpgrade={openReactivate}
        onStartTrial={start}
        onInvite={orgExists ? undefined : () => setTeamValue('invite')}
        onIntegrations={() => { window.location.href = 'Integrations.html'; }}
        onNew={orgExists ? undefined : (id) => setRecordLimit(id === 'upload' ? 'upload' : 'record')}
        promoCard={orgInactive ?
        endedCardDismissed ? null : <TrialEndedCard orgName={orgName} graceDays={graceDays} onUpgrade={openReactivate} onTalkToSales={talkToSales} onDismiss={() => setEndedCardDismissed(true)} /> :
        orgActive ?
        <TrialWidget
          daysLeft={trialDays}
          orgName={orgName}
          onUpgrade={() => setUpgradeOpen(true)}
          onOpen={() => setTrialPopupDay(trialDays)} /> :
        !promoDismissed ?
        <StartTrialPromo orgCreated={orgCreated} onClick={start} onDismiss={() => setPromoDismissed(true)} /> :
        null} />
      
      <main className="canvas">
        {orgExists ?
        <MeetingsSurface
          key={orgInactive ? 'expired' : 'org'}
          mode={orgInactive ? 'expired' : 'org'}
          orgName={orgName}
          hasMeetings={hasMeetings}
          initialView="mine"
          banner={orgInactive ? null : claudeBanner}
          businessTrialDays={orgActive ? trialDays : null}
          onFeatureUse={orgActive ? onFeatureUse : undefined}
          onUpgrade={openReactivate}
          trialPill={null} /> :

        <MeetingsSurface
          key="solo"
          mode="solo"
          hasMeetings={hasMeetings}
          firstMeetingOnly={showClaudeBanner}
          myMeetingsBanner={historyBanner || claudeBanner}
          onStartTrial={start}
          onUpgrade={() => setUpgradeOpen(true)}
          onRecordAttempt={() => setRecordLimit('record')}
          onLockedClick={(m) => setLockedMeeting(m)}
          onShareAttempt={() => setTeamValue('share')} />
        }
      </main>

      <Modal open={step !== null} onClose={close} size={step === 'invite' || step === 'trial' ? 'lg' : 'md'}>
        {step === 'trial' &&
        <TrialBentoStep
          onStart={startFromBento}
          onSelf={close}
          onClose={close} />
        }
        {step === 'existing' &&
        <ExistingOrgStep
          org={EXISTING_PAID_ORG}
          meetingCount={meetingCount}
          onRequest={() => setStep('requested')}
          onClose={close} />
        }
        {step === 'requested' &&
        <RequestSentStep org={EXISTING_PAID_ORG} onDone={close} />
        }
        {step === 'name' &&
        <NameStep
          orgName={orgName}
          onName={setOrgName}
          onClose={close}
          onNext={() => meetingCount === 0 ? finalizeCreate() : setStep('explain')} />
        }
        {step === 'explain' &&
        <ExplainTransferStep
          orgName={orgName}
          meetingCount={meetingCount}
          asAdmin={true}
          inviterName={null}
          onBack={() => setStep('name')}
          onCancel={close}
          onNext={finalizeCreate}
          onClose={close} />
        }
        {step === 'creating' && <CreatingStep orgName={orgName} choice={choice} />}
        {step === 'invite' &&
        <CreatorInviteStep
          orgName={orgName}
          peers={invitePeers}
          selected={selectedInvites}
          onToggle={toggleInvite}
          onSelectAll={() => setSelectedInvites(new Set(invitePeers.map((p) => p.email)))}
          onClear={() => setSelectedInvites(new Set())}
          onSkip={() => setStep('done')}
          onNext={sendInvites}
          onClose={close} />
        }
        {step === 'done' &&
        <SuccessStep
          orgName={orgName}
          choice={choice}
          meetingCount={meetingCount}
          invitedCount={selectedInvites.size}
          onDone={() => {setOrgCreated(true);persistOrg(true, orgName);close();}} />
        }
      </Modal>

      {toast && <Toast>{toast}</Toast>}
      {orgCreated &&
      <TrialCountdown
        daysLeft={trialPopupDay}
        orgName={orgName}
        onUpgrade={() => {setTrialPopupDay(null);setUpgradeOpen(true);}}
        onClose={closeTrial} />
      }
      <UpgradePlanModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reactivate={orgInactive} onTalkToSales={talkToSales} />
      <RecordingLimitModal
        open={!!recordLimit}
        kind={recordLimit || 'record'}
        onClose={() => setRecordLimit(null)}
        onStartTrial={() => { setRecordLimit(null); launchTrial(); }} />
      <LockedMeetingModal
        meeting={lockedMeeting}
        onClose={() => setLockedMeeting(null)}
        onStartTrial={() => { setLockedMeeting(null); launchTrial(); }} />
      <TeamValueModal
        trigger={teamValue}
        onClose={() => setTeamValue(null)}
        onStartTrial={() => { setTeamValue(null); launchTrial(); }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} billingEmail={USER.email} onPaid={completeReactivation} />
      <Modal open={claudeHandoff} onClose={() => setClaudeHandoff(false)} size="md">
        <ClaudeHandoff onReturn={() => setClaudeHandoff(false)} />
      </Modal>
      <Replay onClick={reset} label="Reset prototype" />
      <TrialExpiredInterstitial
        open={orgInactive && !expiryDismissed}
        orgName={orgName}
        graceDays={graceDays}
        onUpgrade={() => { setExpiryDismissed(true); openReactivate(); }}
        onContinueFree={() => setExpiryDismissed(true)} />
      {showTeammateNudge &&
      <TeammateNudge
        name="Maya Chen"
        daysLeft={trialDays}
        onView={() => setTeammateDismissed(true)}
        onClose={() => setTeammateDismissed(true)} />
      }
    </div>);

}

/* ─── Promo card (Start Trial entry point) ─────────────────────────── */

function TrialEndedCard({ orgName = 'your organization', graceDays, onUpgrade, onTalkToSales, onDismiss }) {
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
      <p className="trial-ended-card__desc">Everything stays saved. Meetings you recorded or joined are yours. Meetings shared by teammates unlock when {orgName} is active again.</p>
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
    </div>);
}

function StartTrialPromo({ orgCreated, onClick, onDismiss }) {
  if (orgCreated) {
    return (
      <div className="card">
        <div className="card__thumb" style={{ background: 'linear-gradient(135deg, #E6F7EE 0%, #C3ECD5 100%)', textAlign: 'center', padding: '18px 14px' }}>
          <Icon name="check" size={22} stroke={2.5} style={{ color: '#0B6F3F' }} />
        </div>
        <p className="card__title">Organization ready</p>
        <p className="card__desc">Invite teammates from Members anytime.</p>
      </div>);

  }
  return (
    <div className="card is-clickable" onClick={onClick}>
      <button className="card__dismiss" aria-label="Dismiss" title="Dismiss"
      onClick={(e) => {e.stopPropagation();onDismiss?.();}}>
        <Icon name="close" size={13} stroke={2.25} />
      </button>
      <div className="card__thumb">
        <div className="card__line" />
        <div className="card__line" />
        <div className="card__line" />
        <Icon name="sparkles" size={22} style={{ position: 'absolute', right: -4, bottom: -4, color: '#4F6BFF' }} />
      </div>
      <p className="card__title">Work with your team</p>
      <p className="card__desc">Try Grain Business to get the power of shared meeting context.</p>
      <button className="card__cta card__cta--green" onClick={(e) => {e.stopPropagation();onClick();}}>
        <span className="btn-label">Start trial</span>
      </button>
    </div>);

}

/* ─── Steps ────────────────────────────────────────────────────────── */

/* ── Trial bento ── shown as the first step whenever "Start trial" is clicked
   outside first-run setup (sidebar promo, workspace switcher). Mirrors the
   onboarding ObTrial screen so both paths share one entry point. */
function TrialBentoStep({ onStart, onSelf, onClose }) {
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
        <button className="btn btn--primary btn--pill btn--lg trial-bento__cta" onClick={onStart}>
          <span className="btn-label">Start trial</span>
        </button>
        <button className="trial-bento__self" onClick={onSelf}>
          <span className="btn-label">Use Grain by myself</span>
        </button>
      </div>
    </>);

}

/* ── Enterprise edge: a paid workspace already exists on this domain ── */

function ExistingOrgStep({ org, meetingCount, onRequest, onClose }) {
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
          <span>{meetingCount > 0 ?
            `If you're approved, your ${meetingCount} meetings move into ${org.name} with you. They will not be shared with anyone unless you share them.` :
            `If you're approved, you'll join ${org.name} as a member.`}</span>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--ghost btn--pill" onClick={onClose}><span className="btn-label">Cancel</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onRequest}>
          <span className="btn-label">{`Request to join ${org.name}`}</span>
        </button>
      </div>
    </>);
}

function RequestSentStep({ org, onDone }) {
  return (
    <>
      <div className="modal__body" style={{ padding: '36px 28px 8px' }}>
        <div className="success-block">
          <div className="success-block__mark"><Icon name="send" size={28} stroke={2} /></div>
          <div className="success-block__title">Request sent</div>
          <div className="success-block__sub">{`${org.name}'s admins will review your request. Until then, nothing changes — you keep using Grain on your own and your meetings stay yours.`}</div>
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
    </>);
}

function NameStep({ orgName, onName, onClose, onNext }) {
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
    </>);

}

function ExplainTransferStep({ orgName, meetingCount, asAdmin, inviterName, onBack, onCancel, onNext, onClose }) {
  // The choice is binary: create the organization and your meetings move with
  // you, or don't — and stay single player. No archive path.
  const moveNote = `Your ${meetingCount} meetings move into ${orgName}, and ${orgName} owns them going forward.`;
  const accessNote = `They will not be shared with anyone unless you share them — existing sharing stays exactly as you set it.`;
  const settingsNote = `Your settings — capture preferences, integrations, templates — now apply inside ${orgName}.`;
  const oneWayNote = `This is one-way. There's no separate personal space afterward; if you ever leave ${orgName}, transferred meetings stay with the organization.`;

  return (
    <>
      <div className="modal__head">
        <div className="modal__heading" data-comment-anchor="7fcb135f2b-div-304-9">
          <h2 className="modal__title">{`Your meetings move into ${orgName}`}</h2>
          <p className="modal__sub">{`Creating ${orgName} brings your Grain account with you. Here's exactly what happens:`}</p>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close" /></button>
      </div>
      <div className="modal__body modal__body--tight">
        <div className="xfer-visual">
          <div className="xfer-party">
            <Avatar name={USER.name} size={44} />
            <div className="xfer-party__text">
              <div className="xfer-party__name">{USER.name}</div>
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
              <div className="xfer-party__sub">{asAdmin ? 'Grain Business · you are the admin' : `Grain Business · invited by ${inviterName}`}</div>
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
            <span>{`Not ready? Choose “Don't create” — nothing changes, and you keep using Grain on your own.`}</span> <a href="#">Learn more</a>
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
    </>);

}

function CreatingStep({ orgName, choice }) {
  const sub = `Setting up ${orgName} and moving your meetings in.`;
  return (
    <div className="modal__body" style={{ padding: '36px 24px 36px' }}>
      <div className="loading-block">
        <div className="spinner" />
        <div>
          <div className="loading-block__title">{`Creating ${orgName}…`}</div>
          <div className="loading-block__sub">{sub}</div>
        </div>
      </div>
    </div>);

}

function CreatorInviteStep({ orgName, peers, selected, onToggle, onSelectAll, onClear, onSkip, onNext, onClose }) {
  // Free-form email invites typed into the field at the top — for people who
  // aren't surfaced in the domain/calendar list. Tracked locally and added to
  // the invite total alongside the checkbox selections.
  const [emailDraft, setEmailDraft] = useS1('');
  const [extraEmails, setExtraEmails] = useS1([]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft.trim());
  const addEmail = () => {
    const v = emailDraft.trim().toLowerCase();
    if (!emailValid) return;
    if (!extraEmails.includes(v) && !peers.some((p) => p.email === v)) {
      setExtraEmails((list) => [...list, v]);
    }
    setEmailDraft('');
  };
  const removeEmail = (v) => setExtraEmails((list) => list.filter((e) => e !== v));

  const n = selected.size + extraEmails.length;
  // Slack-style: one constant primary CTA (“Send invites”, disabled until
  // someone is picked) plus a single “Skip for now” escape — no second skip
  // button and no primary that morphs into a skip.
  const label = n === 0 ? 'Send invites' : `Send ${n} ${n === 1 ? 'invite' : 'invites'}`;

  // Empty state: Gmail / personal-domain creators, or domains with no other
  // Grain users and no same-domain meeting participants to suggest. There's
  // nobody to surface, so the manual email field becomes the whole flow.
  const noSuggestions = peers.length === 0;
  const grainPeers = peers.filter((p) => p.onGrain);
  const calendarPeers = peers.filter((p) => !p.onGrain);
  const initialsOf = (name) =>
  name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  const Row = (u) =>
  <div key={u.email}
  className={`user-row ${selected.has(u.email) ? 'is-checked' : ''}`}
  onClick={() => onToggle(u.email)}>
      {u.onGrain ?
    <Avatar name={u.name} /> :
    <span className="user-row__avatar user-row__avatar--ghost"
    style={{ width: 36, height: 36, fontSize: 14 }}>{initialsOf(u.name)}</span>}
      <div className="user-row__text">
        <div className="user-row__name">{u.name}</div>
        <div className="user-row__email">{u.email}</div>
        <div className="user-row__meta">
          {u.onGrain ?
        <><span className="presence-dot" />{u.lastSeen}</> :
        `On ${u.sharedMeetings} of your meetings`}
        </div>
      </div>
      <div className="user-row__check"><Icon name="check" size={14} stroke={3} /></div>
    </div>;

  return (
    <>
      <div className="modal__head">
        <div className="modal__heading">
          <h2 className="modal__title">{`Invite to ${orgName} organization`}</h2>
        </div>
        <button className="modal__close" onClick={onClose}><Icon name="close" /></button>
      </div>
      <div className="modal__body">
        {noSuggestions &&
        <div className="invite-empty">
          <div className="invite-empty__icon"><Icon name="users" /></div>
          <div className="invite-empty__text">
            <p className="invite-empty__title">No teammates to suggest yet</p>
            <p className="invite-empty__desc">We couldn’t find anyone else from your domain on Grain, and your recent meetings don’t include colleagues to invite. Add teammates by email below to bring them into your organization.</p>
          </div>
        </div>}
        <div className="field invite-email">
          <label className="field__label" htmlFor="invite-email-input">{noSuggestions ? 'Invite teammates by email' : 'Invite by email'}</label>
          <div className="field__input">
            <input
              id="invite-email-input"
              type="email"
              placeholder="Enter email address to invite"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault();addEmail();}}} />
            <button
              type="button"
              className="invite-email__add"
              onClick={addEmail}
              disabled={!emailValid}>Add</button>
          </div>
          {extraEmails.length > 0 &&
          <div className="invite-email__chips">
              {extraEmails.map((e) =>
            <span key={e} className="invite-chip">
                  {e}
                  <button type="button" className="invite-chip__x" aria-label={`Remove ${e}`} onClick={() => removeEmail(e)}>
                    <Icon name="close" size={12} />
                  </button>
                </span>)}
            </div>}
        </div>
        {!noSuggestions &&
        <>
        <div className="list-head" data-comment-anchor="16a0aedc7b-div-611-9">
          <span className="list-head__count">{`${n} of ${peers.length} selected`}</span>
          {n === peers.length ?
          <button className="list-head__link" onClick={onClear}>Clear all</button> :
          <button className="list-head__link" onClick={onSelectAll}>Select all</button>}
        </div>
        <div className="user-list">
          {grainPeers.length > 0 &&
          <div className="user-group">
              <div className="user-group__head">
                <span className="user-group__label">On Grain · {grainPeers.length}</span>
              </div>
              {grainPeers.map(Row)}
            </div>
          }
          {calendarPeers.length > 0 &&
          <div className="user-group">
              <div className="user-group__head">
                <span className="user-group__label">From your calendar · {calendarPeers.length}</span>
              </div>
              {calendarPeers.map(Row)}
            </div>
          }
        </div>
        </>}
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--ghost btn--pill" onClick={onSkip}><span className="btn-label">Skip for now</span></button>
        <button className="btn btn--dark btn--pill btn--lg" onClick={onNext} disabled={n === 0}>
          <span className="btn-label">{label}</span>
        </button>
      </div>
    </>);

}

function SuccessStep({ orgName, choice, meetingCount, invitedCount, onDone }) {
  const summaryLine = meetingCount > 0 ?
  `${meetingCount} meetings moved into ${orgName} — not shared with anyone unless you share them.` :
  null;
  return (
    <>
      <div className="modal__body" style={{ padding: '36px 28px 8px' }}>
        <div className="success-block">
          <div className="success-block__mark"><Icon name="check" size={32} stroke={2.5} /></div>
          <div className="success-block__title">{`${orgName} is ready`}</div>
          <div className="success-block__sub">{`You're the admin. Your 14-day Grain Business trial has started.`}</div>
        </div>
      </div>
      <div className="modal__foot modal__foot--end">
        <button className="btn btn--dark btn--pill btn--lg" onClick={onDone}>
          <span className="btn-label">{`Open ${orgName}`}</span>
        </button>
      </div>
    </>);

}

Object.assign(window, {
  StartTrialApp, TrialEndedCard, StartTrialPromo,
  // Reused by the onboarding full-screen workspace setup:
  NameStep, CreatingStep, CreatorInviteStep, SuccessStep,
  CREATOR_USER: USER, CREATOR_DOMAIN_PEERS: DOMAIN_PEERS, orgNameFromDomain
});