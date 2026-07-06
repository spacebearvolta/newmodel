import type { ReactNode } from 'react';
import {
  RecordingLimitModalV2Live,
  HistoryLockBannerV2Live,
  LockedMeetingModalV2Live,
  TeamValueModalV2Live,
  UpgradeGateCardV2Live,
  PlansModalV2Live,
  TrialExpiredInterstitialV2Live,
  TrialEndedCardV2Live,
  FeatureNudgeChipV2Live,
  TeammateNudgeV2Live,
  TrialWidgetV2Live,
  TrialCountdownV2Live,
} from '../components/hooksV2/HooksV2Live';

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
    trigger: 'A free user starts a recording (or uploads a file) longer than 45 minutes.',
    kind: 'modal',
    states: ['Recording', 'Upload'],
    render: (s) => <RecordingLimitModalV2Live open kind={s === 1 ? 'upload' : 'record'} onClose={NOOP} onStartTrial={NOOP} />,
  },
  {
    tag: 'H2',
    title: 'History approaching 30-day lock',
    trigger: 'A free user has meetings nearing the 30-day history limit (shown on My meetings).',
    kind: 'inline',
    states: ['5 days', '3 days', '1 day'],
    render: (s) => (
      <div style={{ width: 620, maxWidth: '88vw' }}>
        <HistoryLockBannerV2Live daysLeft={[5, 3, 1][s]} onStartTrial={NOOP} onDismiss={NOOP} />
      </div>
    ),
  },
  {
    tag: 'H3',
    title: 'Locked meeting (past 30 days)',
    trigger: 'A free user opens a meeting older than the 30-day free history window.',
    kind: 'modal',
    render: () => <LockedMeetingModalV2Live meeting={MEETING} onClose={NOOP} onStartTrial={NOOP} />,
  },
  {
    tag: 'H4 · H5',
    title: 'Invite / Share value modal',
    trigger: 'A free user clicks Invite, or tries to share a recording with a colleague.',
    kind: 'modal',
    states: ['Invite', 'Share'],
    render: (s) => <TeamValueModalV2Live trigger={s === 1 ? 'share' : 'invite'} onClose={NOOP} onStartTrial={NOOP} />,
  },
  {
    tag: 'H6',
    title: 'Feature / integration upgrade gate',
    trigger: 'A free user opens a locked feature (Trackers, Coaching, Teams…) or integration (Slack, HubSpot…).',
    kind: 'inline',
    states: ['Trackers', 'Coaching', 'HubSpot', 'Slack'],
    render: (s) => {
      const gate = [
        { eyebrow: 'Grain Trackers', title: 'Upgrade your plan to access Trackers', desc: 'Track and be automatically alerted of key words or phrases in your meetings.' },
        { eyebrow: 'Grain Coaching', title: 'Upgrade your plan to access Coaching', desc: 'Automate performance scores for effective coaching and personal improvement.' },
        { title: 'Upgrade your plan to connect HubSpot', desc: 'Skip the manual data entry, auto-sync AI notes to HubSpot Contact and Meeting objects.' },
        { title: 'Upgrade your plan to connect Slack', desc: 'Send meeting notes, clips, and Trackers captured by Grain to Slack channels.' },
      ][s];
      // Rendered on a white surface to mirror the real settings/integrations
      // page the gate sits centered in (the component itself is intentionally
      // background-less for that white-page context).
      return (
        <div style={{ width: 620, maxWidth: '88vw', background: '#fff', borderRadius: 10, padding: '56px 24px' }}>
          <UpgradeGateCardV2Live {...gate} onLearnMore={NOOP} onUpgrade={NOOP} />
        </div>
      );
    },
  },
  {
    tag: 'Plans',
    title: 'Plans / pricing modal',
    trigger: 'Opened from any “Upgrade your plan” / “see plans” entry point.',
    kind: 'modal',
    render: () => <PlansModalV2Live open currentPlan="free" onClose={NOOP} onUpgrade={NOOP} onBookDemo={NOOP} />,
  },
  {
    tag: 'H7',
    title: 'Trial expired: interstitial',
    trigger: 'Shown once on the first login after the Business trial ends.',
    kind: 'modal',
    states: ['30 days', '7 days', '3 days', '1 day'],
    render: (s) => (
      <TrialExpiredInterstitialV2Live open orgName="Acme" graceDays={[30, 7, 3, 1][s]} onUpgrade={NOOP} onContinueFree={NOOP} />
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
        <TrialEndedCardV2Live orgName="Acme" graceDays={[30, 7, 1][s]} onUpgrade={NOOP} onTalkToSales={NOOP} />
      </div>
    ),
  },
  {
    tag: 'H8',
    title: 'Feature-usage nudge',
    trigger: 'Mid-trial use of a Business-only feature: team meetings, sharing, AI actions, integrations.',
    kind: 'inline',
    states: ['Team meetings', 'Sharing', 'AI actions', 'Integrations'],
    render: (s) => (
      <FeatureNudgeChipV2Live
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
    render: () => <TeammateNudgeV2Live name="Maya Chen" daysLeft={8} onView={NOOP} onClose={NOOP} />,
  },
  {
    tag: 'Trial',
    title: 'Trial countdown widget',
    trigger: 'Persistent sidebar card throughout the active Business trial.',
    kind: 'inline',
    states: ['14', '8', '5', '3', '1'],
    render: (s) => (
      <div style={{ width: 244 }}>
        <TrialWidgetV2Live daysLeft={[14, 8, 5, 3, 1][s]} onUpgrade={NOOP} onOpen={NOOP} />
      </div>
    ),
  },
  {
    tag: 'Trial',
    title: 'Trial countdown popup',
    trigger: 'Opens from the trial pill / widget at milestone days remaining.',
    kind: 'modal',
    states: ['8 days', '3 days', '1 day'],
    render: (s) => <TrialCountdownV2Live daysLeft={[8, 3, 1][s]} orgName="Acme" onUpgrade={NOOP} onClose={NOOP} />,
  },
];
