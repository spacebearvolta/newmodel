import type { ReactNode } from 'react';
import { RecordingLimitModal } from '../components/hooks/RecordingLimitModal';
import { HistoryLockBanner } from '../components/hooks/HistoryLockBanner';
import { LockedMeetingModal } from '../components/hooks/LockedMeetingModal';
import { TeamValueModal } from '../components/hooks/TeamValueModal';
import { HgGateCard } from '../components/hooks/HgGateCard';
import { TrialExpiredInterstitial } from '../components/hooks/TrialExpiredInterstitial';
import { TrialEndedCard } from '../components/hooks/TrialEndedCard';
import { FeatureNudgeChip } from '../components/hooks/FeatureNudgeChip';
import { TeammateNudge } from '../components/hooks/TeammateNudge';
import { TrialWidget } from '../components/trial/TrialWidget';
import { TrialCountdown } from '../components/trial/TrialCountdown';

const NOOP = () => {};
const MEETING = { title: 'Q2 planning offsite — day 1', date: 'Recorded May 8' };

export interface HookEntry {
  tag: string;
  title: string;
  trigger: string;
  kind: 'modal' | 'inline';
  states?: string[];
  render: (s: number) => ReactNode;
}

export const HG_HOOKS: HookEntry[] = [
  {
    tag: 'H1',
    title: 'Recording length wall',
    trigger: 'A free user starts a recording — or uploads a file — longer than 45 minutes.',
    kind: 'modal',
    states: ['Recording', 'Upload'],
    render: (s) => <RecordingLimitModal open kind={s === 1 ? 'upload' : 'record'} onClose={NOOP} onStartTrial={NOOP} />,
  },
  {
    tag: 'H2',
    title: 'History approaching 30-day lock',
    trigger: 'A free user has meetings nearing the 30-day history limit (shown on My meetings).',
    kind: 'inline',
    states: ['5 days', '3 days', '1 day'],
    render: (s) => (
      <div style={{ width: 620, maxWidth: '88vw' }}>
        <HistoryLockBanner daysLeft={[5, 3, 1][s]} onStartTrial={NOOP} onDismiss={NOOP} />
      </div>
    ),
  },
  {
    tag: 'H3',
    title: 'Locked meeting (past 30 days)',
    trigger: 'A free user opens a meeting older than the 30-day free history window.',
    kind: 'modal',
    render: () => <LockedMeetingModal meeting={MEETING} onClose={NOOP} onStartTrial={NOOP} />,
  },
  {
    tag: 'H4 · H5',
    title: 'Invite / Share value modal',
    trigger: 'A free user clicks Invite, or tries to share a recording with a colleague.',
    kind: 'modal',
    states: ['Invite', 'Share'],
    render: (s) => <TeamValueModal trigger={s === 1 ? 'share' : 'invite'} onClose={NOOP} onStartTrial={NOOP} />,
  },
  {
    tag: 'H6',
    title: 'CRM connection gate',
    trigger: 'A free user opens a CRM / workspace integration (HubSpot, Salesforce, …).',
    kind: 'inline',
    render: () => <HgGateCard />,
  },
  {
    tag: 'H7',
    title: 'Trial expired — interstitial',
    trigger: 'Shown once on the first login after the Business trial ends.',
    kind: 'modal',
    states: ['30 days', '7 days', '3 days', '1 day'],
    render: (s) => (
      <TrialExpiredInterstitial open orgName="Acme" graceDays={[30, 7, 3, 1][s]} onUpgrade={NOOP} onContinueFree={NOOP} />
    ),
  },
  {
    tag: 'H7',
    title: 'Trial-ended widget (grace countdown)',
    trigger: 'Persistent sidebar card after the trial ends; counts down the grace period.',
    kind: 'inline',
    states: ['30 days', '7 days', '1 day'],
    render: (s) => (
      <div style={{ width: 244 }}>
        <TrialEndedCard orgName="Acme" graceDays={[30, 7, 1][s]} onUpgrade={NOOP} onTalkToSales={NOOP} onDismiss={NOOP} />
      </div>
    ),
  },
  {
    tag: 'H8',
    title: 'Feature-usage nudge',
    trigger: 'Mid-trial use of a Business-only feature — team meetings, sharing, AI actions, integrations.',
    kind: 'inline',
    states: ['Team meetings', 'Sharing', 'AI actions', 'Integrations'],
    render: (s) => (
      <FeatureNudgeChip
        feature={['Team meetings', 'Sharing to a team', 'AI actions on shared meetings', 'Workspace integrations'][s]}
        daysLeft={8}
        onDismiss={NOOP}
      />
    ),
  },
  {
    tag: 'H9',
    title: 'Teammate engagement nudge',
    trigger: 'A teammate’s first meeting is captured in the trial workspace.',
    kind: 'inline',
    render: () => <TeammateNudge name="Maya Chen" daysLeft={8} onView={NOOP} onClose={NOOP} />,
  },
  {
    tag: 'Trial',
    title: 'Trial countdown widget',
    trigger: 'Persistent sidebar card throughout the active Business trial.',
    kind: 'inline',
    states: ['14', '8', '5', '3', '1'],
    render: (s) => (
      <div style={{ width: 244 }}>
        <TrialWidget daysLeft={[14, 8, 5, 3, 1][s]} orgName="Acme" onUpgrade={NOOP} onOpen={NOOP} />
      </div>
    ),
  },
  {
    tag: 'Trial',
    title: 'Trial countdown popup',
    trigger: 'Opens from the trial pill / widget at milestone days remaining.',
    kind: 'modal',
    states: ['8 days', '3 days', '1 day'],
    render: (s) => <TrialCountdown daysLeft={[8, 3, 1][s]} orgName="Acme" onUpgrade={NOOP} onClose={NOOP} />,
  },
];
