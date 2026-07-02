import { useEffect, useState } from 'react';
import { Sidebar } from '../shell/Sidebar';
import { MeetingsSurface } from '../meetings/MeetingsSurface';
import { Modal } from '../primitives/Modal';
import { Toast } from '../shell/Toast';
import { Replay } from '../shell/Replay';
import { UpgradePlanModal, CheckoutModal } from '../upgrade/UpgradeModal';
import {
  RecordingLimitModalV2Live, HistoryLockBannerV2Live, LockedMeetingModalV2Live, TeamValueModalV2Live,
  TrialExpiredInterstitialV2Live, TrialEndedCardV2Live, TrialWidgetV2Live, TeammateNudgeV2Live, TrialCountdownV2Live,
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
  trialDays = TRIAL_TOTAL, hasMeetings = true, trialOver = false, paidOrgOnDomain = false,
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
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [recordLimit, setRecordLimit] = useState<null | 'record' | 'upload'>(null); // H1
  const [historyDismissed, setHistoryDismissed] = useState(false); // H2
  const [lockedMeeting, setLockedMeeting] = useState<Meeting | null>(null); // H3
  const [teamValue, setTeamValue] = useState<null | 'invite' | 'share'>(null); // H4/H5
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
      setToast(`${n} invite${n === 1 ? '' : 's'} sent`);
      setTimeout(() => setToast(null), 2200);
    }
    setStep('done');
  };

  const orgExists = orgCreated || trialOver;
  const orgInactive = trialOver;
  const orgActive = orgExists && !orgInactive;
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

  const onFeatureUse = (f: string) => {
    const FEATURE_LABELS: Record<string, string> = { share: 'Sharing to a team', ai: 'AI actions on shared meetings', integration: 'Workspace integrations' };
    const label = FEATURE_LABELS[f] || 'This';
    setToast(`${label} is a Grain Business feature — ${trialDays} ${trialDays === 1 ? 'day' : 'days'} left in your trial.`);
    setTimeout(() => setToast(null), 3400);
  };

  useEffect(() => {
    if (!orgActive || teammateAuto || teammateDismissed) return undefined;
    const id = setTimeout(() => setTeammateAuto(true), 2500);
    return () => clearTimeout(id);
  }, [orgActive, teammateAuto, teammateDismissed]);
  useEffect(() => { if (teammateNudge) setTeammateDismissed(false); }, [teammateNudge]);

  const showTeammateNudge = orgActive && (teammateNudge || teammateAuto) && !teammateDismissed;

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
        onInvite={orgExists ? undefined : () => setTeamValue('invite')}
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
            initialView="mine"
            banner={orgInactive ? null : claudeBanner}
            businessTrialDays={orgActive ? trialDays : null}
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
            onShareAttempt={() => setTeamValue('share')}
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

      {toast && <Toast>{toast}</Toast>}
      {orgCreated && (
        <TrialCountdownV2Live daysLeft={trialPopupDay} orgName={orgName} onUpgrade={() => { setTrialPopupDay(null); setUpgradeOpen(true); }} onClose={closeTrial} />
      )}
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
      <TeamValueModalV2Live
        trigger={teamValue}
        onClose={() => setTeamValue(null)}
        onStartTrial={() => { setTeamValue(null); launchTrial(); }}
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
        <TeammateNudgeV2Live name="Maya Chen" daysLeft={trialDays} onView={() => setTeammateDismissed(true)} onClose={() => setTeammateDismissed(true)} />
      )}
    </div>
  );
}
