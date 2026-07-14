import { useEffect, useState } from 'react';
import { Sidebar } from '../shell/Sidebar';
import { MeetingsSurface } from '../meetings/MeetingsSurface';
import { Modal } from '../primitives/Modal';
import { Toast } from '../shell/Toast';
import { Replay } from '../shell/Replay';
import { UpgradePlanModal, CheckoutModal } from '../upgrade/UpgradeModal';
import { readShowParam } from '../tweaks/TweaksPanel';
import mayaPhoto from '../../assets/maya.jpg';
import {
  RecordingLimitModalV2Live, HistoryLockBannerV2Live, LockedMeetingModalV2Live,
  TrialExpiredInterstitialV2Live, TrialEndedCardV2Live, TrialWidgetV2Live, TeammateNudgeV2Live, TrialCountdownV2Live,
  InviteUpsellModalV2Live, ShareLinkModalV2Live, PlansModalV2Live,
} from '../hooksV2/HooksV2Live';
import {
  ClaudeMeetingBanner, ClaudeHandoff, StartTrialPromo, TrialBentoStep, ExistingOrgStep, RequestSentStep,
  NameStep, ExplainTransferStep, CreatingStep, CreatorInviteStep, SuccessStep,
} from './FlowCreatorSteps';
import {
  USER, DOMAIN_PEERS, EXISTING_PAID_ORG, MS_MY_MEETING_COUNT, orgNameFromDomain,
} from '../../data/meetings';
import type { Meeting } from '../../data/meetings';

type Step = null | 'trial' | 'existing' | 'requested' | 'name' | 'explain' | 'creating' | 'invite' | 'done';

export interface CreatorAppProps {
  onSettings?: () => void;
  onOrgAdmin?: () => void;
  onIntegrations?: () => void;
  trialDays?: number;
  hasMeetings?: boolean;
  trialActive?: boolean;
  trialOver?: boolean;
  paidOrgOnDomain?: boolean;
  showClaudeBanner?: boolean;
  emptyDomain?: boolean;
  graceDays?: number;
  teammateNudge?: boolean;
}

const TRIAL_TOTAL = 14;

export function CreatorApp({
  onSettings, onOrgAdmin, onIntegrations,
  trialDays = TRIAL_TOTAL, hasMeetings = true, trialActive = false, trialOver = false, paidOrgOnDomain = false,
  showClaudeBanner = false, emptyDomain = false, graceDays = 30, teammateNudge = false,
}: CreatorAppProps) {
  const meetingCount = hasMeetings ? MS_MY_MEETING_COUNT : 0;
  const invitePeers = emptyDomain ? [] : DOMAIN_PEERS;

  const [step, setStep] = useState<Step>(null);
  const [orgName, setOrgName] = useState(() => {
    try { return localStorage.getItem('grain.orgName') || orgNameFromDomain(USER.domain); }
    catch { return orgNameFromDomain(USER.domain); }
  });
  const [selectedInvites, setSelectedInvites] = useState<Set<string>>(new Set());
  const [orgCreated, setOrgCreated] = useState(() => {
    try { return localStorage.getItem('grain.orgCreated') === '1'; } catch { return false; }
  });
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false); // Plans / pricing modal (v2)
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; icon: string } | null>(null);

  const [recordLimit, setRecordLimit] = useState<null | 'record' | 'upload'>(null); // H1
  const [historyDismissed, setHistoryDismissed] = useState(false); // H2
  const [lockedMeeting, setLockedMeeting] = useState<Meeting | null>(null); // H3
  const [shareLink, setShareLink] = useState(false); // State A — view-only link modal
  const [inviteForm, setInviteForm] = useState(false); // States B/C/D/E — invite-to-collaborate modal
  const [pendingInviteEmail, setPendingInviteEmail] = useState<string | null>(null); // carried into org-creation invite step
  const [expiryDismissed, setExpiryDismissed] = useState(false); // H7 interstitial
  const [teammateDismissed, setTeammateDismissed] = useState(false); // H9
  const [teammateAuto, setTeammateAuto] = useState(false);
  const [claudeDismissed, setClaudeDismissed] = useState(false);
  const [claudeHandoff, setClaudeHandoff] = useState(false);

  const [trialPopupDay, setTrialPopupDay] = useState<number | null>(null);
  const [, setTrialSeen] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('grain.trialSeen') || '[]')); }
    catch { return new Set(); }
  });
  const closeTrial = () => {
    setTrialPopupDay(null);
    setTrialSeen((prev) => {
      const next = new Set(prev);
      next.add(trialDays);
      try { localStorage.setItem('grain.trialSeen', JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  // Deep-link: gallery "View in prototype" links pass ?show=<hook> to auto-open
  // the matching modal on mount (tweaks like trial-over come in via ?tw=).
  useEffect(() => {
    const show = readShowParam();
    if (!show) return;
    if (show === 'invite' || show === 'inviteForm') setInviteForm(true);
    else if (show === 'share') setShareLink(true);
    else if (show === 'record') setRecordLimit('record');
    else if (show === 'upload') setRecordLimit('upload');
    else if (show === 'locked') setLockedMeeting({ title: 'Q2 planning offsite — day 1', date: 'Recorded May 8' } as Meeting);
    else if (show === 'trialPopup') setTrialPopupDay(trialDays);
    else if (show === 'plans') setPlansOpen(true);
    // H8 contextual nudges fire as toasts, triggered by the action itself.
    else if (show === 'toast-share') onFeatureUse('share');
    else if (show === 'toast-ai') onFeatureUse('ai');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deep-link: the H8 "Team meetings" nudge lands on the Team meetings tab
  // where its chip lives. (Sharing / AI / integrations nudge as toasts instead.)
  const nudgeFeature = readShowParam() === 'nudge-teamMeetings' ? 'Team meetings' : null;
  // When reviewing a feature-usage toast, don't also pop the teammate nudge —
  // the toast should be viewable on its own.
  const viewingToast = readShowParam() === 'toast-share' || readShowParam() === 'toast-ai';
  const orgInitialView = nudgeFeature ? 'all' : 'mine';

  const persistOrg = (created: boolean, name?: string) => {
    try {
      if (created) {
        localStorage.setItem('grain.orgCreated', '1');
        localStorage.setItem('grain.orgName', name || orgName);
      } else {
        localStorage.removeItem('grain.orgCreated');
        localStorage.removeItem('grain.orgName');
      }
    } catch { /* ignore */ }
  };

  const reset = () => {
    persistOrg(false);
    try { localStorage.removeItem('grain.onboarded'); localStorage.removeItem('grain.trialSeen'); } catch { /* ignore */ }
    window.location.href = '/onboarding';
  };

  const start = () => {
    setOrgName(orgNameFromDomain(USER.domain));
    setSelectedInvites(new Set());
    setStep(paidOrgOnDomain ? 'existing' : 'trial');
  };
  // Invite always creates the user's OWN workspace and sends the invite, even
  // when a paid org exists on the domain — the "request to join" nudge belongs
  // to the sidebar set-up-org path, not to "invite your team".
  const startInviteFlow = () => {
    setOrgName(orgNameFromDomain(USER.domain));
    setSelectedInvites(new Set());
    setStep('trial');
  };
  const startFromBento = () => setStep('name');
  const close = () => setStep(null);

  const finalizeCreate = () => {
    setStep('creating');
    setTimeout(() => setStep('invite'), 1500);
  };

  const toggleInvite = (email: string) => {
    setSelectedInvites((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email); else next.add(email);
      return next;
    });
  };

  const sendInvites = () => {
    if (selectedInvites.size > 0) {
      const n = selectedInvites.size;
      setToast({ msg: `${n} invite${n === 1 ? '' : 's'} sent`, icon: 'check' });
      setTimeout(() => setToast(null), 2200);
    }
    setStep('done');
  };

  const orgExists = orgCreated || trialOver || trialActive;
  const orgInactive = trialOver;
  const orgActive = orgExists && !orgInactive;
  const openReactivate = () => setCheckoutOpen(true);
  const talkToSales = () => {
    setUpgradeOpen(false);
    setCheckoutOpen(false);
    setToast({ msg: 'Thanks. Our team will reach out about reactivating your trial.', icon: 'check' });
    setTimeout(() => setToast(null), 2600);
  };
  const completeReactivation = () => {
    setCheckoutOpen(false);
    setToast({ msg: `Payment received. ${orgName} is active again.`, icon: 'check' });
    setTimeout(() => setToast(null), 2800);
  };

  // Once the workspace is provisioned and we reach the invite step, pre-select
  // the teammate the user set out to invite (a domain peer gets checked; a
  // non-peer address rides in via CreatorInviteStep's initialEmails chip).
  useEffect(() => {
    if (step === 'invite' && pendingInviteEmail && invitePeers.some((p) => p.email === pendingInviteEmail)) {
      setSelectedInvites((prev) => new Set(prev).add(pendingInviteEmail));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const onFeatureUse = (f: string) => {
    const FEATURE_LABELS: Record<string, string> = { share: 'Sharing to a team', ai: 'AI actions on shared meetings', integration: 'Workspace integrations' };
    const FEATURE_ICONS: Record<string, string> = { share: 'share2', ai: 'sparkles', integration: 'plug' };
    const label = FEATURE_LABELS[f] || 'This';
    setToast({ msg: `${label} is a Grain Business feature: ${trialDays} ${trialDays === 1 ? 'day' : 'days'} left in your trial.`, icon: FEATURE_ICONS[f] || 'sparkles' });
    setTimeout(() => setToast(null), 3400);
  };

  useEffect(() => {
    if (!orgActive || viewingToast || teammateAuto || teammateDismissed) return undefined;
    const id = setTimeout(() => setTeammateAuto(true), 2500);
    return () => clearTimeout(id);
  }, [orgActive, viewingToast, teammateAuto, teammateDismissed]);
  useEffect(() => { if (teammateNudge) setTeammateDismissed(false); }, [teammateNudge]);

  const showTeammateNudge = orgActive && (teammateNudge || teammateAuto) && !teammateDismissed && !viewingToast;

  const claudeBanner = showClaudeBanner && !claudeDismissed
    ? <ClaudeMeetingBanner onConnect={() => setClaudeHandoff(true)} onDismiss={() => setClaudeDismissed(true)} />
    : null;

  const launchTrial = () => setUpgradeOpen(true);
  const historyBanner = (!orgExists && hasMeetings && !historyDismissed)
    ? <HistoryLockBannerV2Live daysLeft={5} onStartTrial={launchTrial} onDismiss={() => setHistoryDismissed(true)} />
    : null;

  return (
    <div className="app">
      <Sidebar
        user={USER}
        orgName={orgExists ? orgName : 'Personal'}
        hasOrg={orgExists}
        adminPaused={orgInactive}
        onSettings={onSettings}
        onOrgAdmin={orgActive ? onOrgAdmin : orgInactive ? openReactivate : start}
        onUpgrade={openReactivate}
        onStartTrial={start}
        onInvite={orgActive ? undefined : () => setInviteForm(true)}
        onIntegrations={onIntegrations}
        onNew={orgExists ? undefined : (id) => setRecordLimit(id === 'upload' ? 'upload' : 'record')}
        promoCard={orgInactive
          ? <TrialEndedCardV2Live orgName={orgName} graceDays={graceDays} onUpgrade={openReactivate} onTalkToSales={talkToSales} />
          : orgActive
            ? <TrialWidgetV2Live daysLeft={trialDays} onUpgrade={() => setUpgradeOpen(true)} onOpen={() => setTrialPopupDay(trialDays)} />
            : !promoDismissed
              ? <StartTrialPromo orgCreated={orgCreated} onClick={start} onDismiss={() => setPromoDismissed(true)} />
              : null}
      />

      <main className="canvas">
        {orgExists ? (
          <MeetingsSurface
            key={orgInactive ? 'expired' : 'org'}
            mode={orgInactive ? 'expired' : 'org'}
            orgName={orgName}
            hasMeetings={hasMeetings}
            initialView={orgInitialView}
            banner={orgInactive ? null : claudeBanner}
            businessTrialDays={orgActive ? trialDays : null}
            nudgeFeature={nudgeFeature}
            onFeatureUse={orgActive ? onFeatureUse : undefined}
            onUpgrade={openReactivate}
          />
        ) : (
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
            onShareAttempt={() => setShareLink(true)}
          />
        )}
      </main>

      <Modal open={step !== null} onClose={close} size={step === 'invite' || step === 'trial' ? 'lg' : 'md'}>
        {step === 'trial' && <TrialBentoStep onStart={startFromBento} onSelf={close} onClose={close} />}
        {step === 'existing' && (
          <ExistingOrgStep org={EXISTING_PAID_ORG} meetingCount={meetingCount} onRequest={() => setStep('requested')} onClose={close} />
        )}
        {step === 'requested' && <RequestSentStep org={EXISTING_PAID_ORG} onDone={close} />}
        {step === 'name' && (
          <NameStep orgName={orgName} onName={setOrgName} onClose={close} onNext={() => (meetingCount === 0 ? finalizeCreate() : setStep('explain'))} />
        )}
        {step === 'explain' && (
          <ExplainTransferStep
            orgName={orgName}
            meetingCount={meetingCount}
            userName={USER.name}
            onBack={() => setStep('name')}
            onCancel={close}
            onNext={finalizeCreate}
            onClose={close}
          />
        )}
        {step === 'creating' && <CreatingStep orgName={orgName} />}
        {step === 'invite' && (
          <CreatorInviteStep
            orgName={orgName}
            peers={invitePeers}
            selected={selectedInvites}
            initialEmails={pendingInviteEmail ? [pendingInviteEmail] : []}
            onToggle={toggleInvite}
            onSelectAll={() => setSelectedInvites(new Set(invitePeers.map((p) => p.email)))}
            onClear={() => setSelectedInvites(new Set())}
            onSkip={() => setStep('done')}
            onNext={sendInvites}
            onClose={close}
          />
        )}
        {step === 'done' && (
          <SuccessStep orgName={orgName} onDone={() => { setOrgCreated(true); persistOrg(true, orgName); close(); }} />
        )}
      </Modal>

      {toast && <Toast icon={toast.icon}>{toast.msg}</Toast>}
      {(orgCreated || trialActive) && (
        <TrialCountdownV2Live daysLeft={trialPopupDay} orgName={orgName} onUpgrade={() => { setTrialPopupDay(null); setUpgradeOpen(true); }} onClose={closeTrial} />
      )}
      <PlansModalV2Live
        open={plansOpen}
        currentPlan="free"
        onClose={() => setPlansOpen(false)}
        onUpgrade={() => { setPlansOpen(false); setUpgradeOpen(true); }}
        onBookDemo={talkToSales}
      />
      <UpgradePlanModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reactivate={orgInactive} onTalkToSales={talkToSales} />
      <RecordingLimitModalV2Live
        open={!!recordLimit}
        kind={recordLimit || 'record'}
        onClose={() => setRecordLimit(null)}
        onStartTrial={() => { setRecordLimit(null); launchTrial(); }}
      />
      <LockedMeetingModalV2Live
        meeting={lockedMeeting ? { title: lockedMeeting.title, date: lockedMeeting.date || '' } : null}
        onClose={() => setLockedMeeting(null)}
        onStartTrial={() => { setLockedMeeting(null); launchTrial(); }}
      />
      <ShareLinkModalV2Live
        open={shareLink}
        onClose={() => setShareLink(false)}
        onCollaborate={() => { setShareLink(false); setInviteForm(true); }}
      />
      <InviteUpsellModalV2Live
        open={inviteForm}
        workspace={orgExists ? orgName : 'your workspace'}
        state={orgInactive ? 'trial-over' : 'free'}
        userDomain={USER.domain}
        onClose={() => setInviteForm(false)}
        onViewLink={() => { setInviteForm(false); setShareLink(true); }}
        onPrimary={(emailAddr) => {
          setInviteForm(false);
          if (orgInactive) { openReactivate(); return; }
          // Trial-first: provision the user's workspace, carrying the invitee forward.
          setPendingInviteEmail(emailAddr || null);
          startInviteFlow();
        }}
        onLearnMore={() => {}}
      />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} billingEmail={USER.email} onPaid={completeReactivation} />
      <Modal open={claudeHandoff} onClose={() => setClaudeHandoff(false)} size="md">
        <ClaudeHandoff onReturn={() => setClaudeHandoff(false)} />
      </Modal>
      <Replay onClick={reset} label="Reset prototype" />
      <TrialExpiredInterstitialV2Live
        open={orgInactive && !expiryDismissed}
        orgName={orgName}
        graceDays={graceDays}
        onUpgrade={() => { setExpiryDismissed(true); openReactivate(); }}
        onContinueFree={() => setExpiryDismissed(true)}
      />
      {showTeammateNudge && (
        <TeammateNudgeV2Live name="Maya Chen" avatarSrc={mayaPhoto} daysLeft={trialDays} onView={() => setTeammateDismissed(true)} onClose={() => setTeammateDismissed(true)} />
      )}
    </div>
  );
}
