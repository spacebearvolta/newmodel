import { useEffect, useState } from 'react';
import { Sidebar } from '../shell/Sidebar';
import { MeetingsSurface } from '../meetings/MeetingsSurface';
import { Modal } from '../primitives/Modal';
import { Replay } from '../shell/Replay';
import { UpgradePlanModal } from '../upgrade/UpgradeModal';
import {
  InviteStep, JExplainTransferStep, DecisionStep, JoiningStep, JoinedStep,
  InvitePromoCard, JoinedPromoCard, DeclinedPromoCard,
} from './FlowJoinerSteps';
import type { Invite } from './FlowJoinerSteps';
import { MS_MY_MEETING_COUNT } from '../../data/meetings';

const JOINER_USER = { name: 'Jeff Whitlock', email: 'jeff@acme.com', domain: 'acme.com' };

const INVITE: Invite = {
  orgName: 'Acme', orgSlug: 'acme',
  inviterName: 'Priya Sundaram', inviterEmail: 'priya@acme.com', inviterRole: 'Organization admin',
  inviteDate: 'Today', memberCount: 12,
};

type Step = null | 'invite' | 'explain' | 'decision' | 'joining' | 'joined';

export interface JoinerAppProps {
  onSettings?: () => void;
  onReset?: () => void;
  hasMeetings?: boolean;
  inOrg?: boolean;
}

export function JoinerApp({ onSettings, onReset, hasMeetings = true, inOrg = false }: JoinerAppProps) {
  const meetingCount = hasMeetings ? MS_MY_MEETING_COUNT : 0;
  const [step, setStep] = useState<Step>(null);
  const [choice, setChoice] = useState<'join' | 'decline' | null>(null);
  const [joined, setJoined] = useState(inOrg);
  const [declined, setDeclined] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Keep the flow in sync when the tweak flips after mount.
  useEffect(() => {
    setJoined(inOrg);
    setDeclined(false);
    setStep(null);
    setChoice(null);
  }, [inOrg]);

  const open = () => { setChoice(null); setStep('invite'); };
  const close = () => setStep(null);

  const finalizeJoin = () => {
    setChoice('join');
    setStep('joining');
    setTimeout(() => { setJoined(true); setStep('joined'); }, 1500);
  };

  const accept = () => (meetingCount === 0 ? finalizeJoin() : setStep('explain'));
  const decline = () => { setDeclined(true); setStep(null); };

  const updatesBadge = !joined && !declined ? '1' : undefined;

  const promoCard = joined
    ? (inOrg ? null : <JoinedPromoCard orgName={INVITE.orgName} />)
    : declined
      ? <DeclinedPromoCard />
      : <InvitePromoCard invite={INVITE} onView={open} />;

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
        onUpdatesClick={() => { if (!joined && !declined) open(); }}
        promoCard={promoCard}
      />
      <main className="canvas">
        {joined ? (
          <MeetingsSurface key="joined" mode="org" orgName={INVITE.orgName} hasMeetings={hasMeetings} initialView="mine" onUpgrade={() => setUpgradeOpen(true)} />
        ) : (
          <MeetingsSurface
            key="solo"
            mode="solo"
            hasMeetings={hasMeetings}
            onStartTrial={declined ? () => setUpgradeOpen(true) : open}
            gate={declined ? undefined : {
              title: `Join ${INVITE.orgName} to see shared meetings`,
              desc: `All meetings is ${INVITE.orgName}'s shared library — every meeting teammates share to a team shows up here. Your invite from ${INVITE.inviterName.split(' ')[0]} includes access.`,
              cta: `View your invite to ${INVITE.orgName}`,
              note: `${INVITE.memberCount} teammates already share meeting context`,
            }}
            onUpgrade={() => setUpgradeOpen(true)}
          />
        )}
      </main>

      <Modal open={step !== null} onClose={close} size="md">
        {step === 'invite' && <InviteStep invite={INVITE} onAccept={accept} onDecline={decline} onClose={close} />}
        {step === 'explain' && (
          <JExplainTransferStep
            orgName={INVITE.orgName}
            meetingCount={meetingCount}
            inviterName={INVITE.inviterName}
            userName={JOINER_USER.name}
            onBack={() => setStep('invite')}
            onNext={() => setStep('decision')}
            onClose={close}
          />
        )}
        {step === 'decision' && (
          <DecisionStep
            orgName={INVITE.orgName}
            choice={choice}
            onChoice={setChoice}
            meetingCount={meetingCount}
            onBack={() => setStep('explain')}
            onClose={close}
            onNext={() => (choice === 'join' ? finalizeJoin() : decline())}
          />
        )}
        {step === 'joining' && <JoiningStep orgName={INVITE.orgName} />}
        {step === 'joined' && (
          <JoinedStep orgName={INVITE.orgName} meetingCount={meetingCount} inviterName={INVITE.inviterName} memberCount={INVITE.memberCount} onDone={close} />
        )}
      </Modal>

      <UpgradePlanModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} showTrialBadge={false} />
      <Replay onClick={onReset} label="Reset prototype" />
    </div>
  );
}
