import type { ReactNode } from 'react';
import { Icon } from '../components/primitives/Icon';
import mayaPhoto from '../assets/maya.jpg';
import {
  RecordingLimitModalV2Live,
  HistoryLockBannerV2Live,
  LockedMeetingModalV2Live,
  UpgradeGateCardV2Live,
  PlansModalV2Live,
  TrialExpiredInterstitialV2Live,
  TrialEndedCardV2Live,
  FeatureNudgeChipV2Live,
  TeammateNudgeV2Live,
  TrialWidgetV2Live,
  TrialCountdownV2Live,
  InlineUpgradeV2Live,
  UpgradeBadgeV2Live,
  MediaLockOverlayV2Live,
  LockedRecordingCardV2Live,
  InviteUpsellModalV2Live,
  ShareLinkModalV2Live,
  BusinessShareModalV2Live,
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
  // Where this hook lives in the running prototype. Powers the gallery's
  // "View in prototype" deep-link: route + tweak-state (?tw=) + optional
  // modal trigger (?show=).
  context?: { route: string; tweaks?: Record<string, unknown>; show?: string };
  // Per-state override: when a hook's states each live at a different spot in
  // the prototype, contexts[stateIndex] wins over the shared `context`.
  contexts?: Array<{ route: string; tweaks?: Record<string, unknown>; show?: string }>;
}

export const HG_HOOKS: HookEntry[] = [
  {
    tag: 'H1',
    title: 'Recording length wall',
    trigger: 'Recording variant fires live on the recording page at the 45-min cap; upload variant fires when a free user uploads a file over 45 min.',
    kind: 'modal',
    states: ['Recording', 'Upload'],
    // Recording state lives on the live recording page (/live); upload state
    // pops in place from the "New → upload" action.
    contexts: [
      { route: '/live' },
      { route: '/', show: 'upload' },
    ],
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
    tag: 'Share',
    title: 'Share link (view-only)',
    trigger: 'State A — clicking Share. A free, ungated public view-only link; collaboration is the paid unlock, handed off to the invite flow.',
    kind: 'modal',
    render: () => <ShareLinkModalV2Live open onClose={NOOP} onCollaborate={NOOP} />,
  },
  {
    tag: 'Share',
    title: 'Share with a message (Business)',
    trigger: 'Org active / trial active / paying Business user — sharing isn’t gated. Add recipients + a message; members view & edit, non-members get a link.',
    kind: 'modal',
    render: () => <BusinessShareModalV2Live open onClose={NOOP} onShare={NOOP} />,
  },
  {
    tag: 'H6',
    title: 'Feature / integration upgrade gate',
    trigger: 'A free user opens a locked feature (Trackers, Coaching, Teams…) or integration (Slack, HubSpot…).',
    kind: 'inline',
    states: ['Trackers', 'Coaching', 'HubSpot', 'Slack'],
    render: (s) => {
      const gate = [
        { title: 'Upgrade your plan to access Trackers', desc: 'Track and be automatically alerted of key words or phrases in your meetings.' },
        { title: 'Upgrade your plan to access Coaching', desc: 'Automate performance scores for effective coaching and personal improvement.' },
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
    render: () => (
      <TrialExpiredInterstitialV2Live open orgName="Acme" onUpgrade={NOOP} onContinueFree={NOOP} />
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
    trigger: 'Mid-trial use of a Business feature. Team meetings is a persistent chip (its tab is the context); sharing, AI actions, and integrations fire as a toast right after you do the action.',
    kind: 'inline',
    states: ['Team meetings', 'Sharing', 'AI actions', 'Integrations'],
    // Team meetings = chip on the team tab. The other three fire as toasts in
    // the context of the action (share a meeting / run an AI action / connect
    // an integration).
    contexts: [
      { route: '/', tweaks: { trialActive: true }, show: 'nudge-teamMeetings' },
      { route: '/', tweaks: { trialActive: true }, show: 'toast-share' },
      { route: '/', tweaks: { trialActive: true }, show: 'toast-ai' },
      { route: '/integrations', tweaks: { plan: 'business' }, show: 'nudge' },
    ],
    render: (s) => {
      if (s === 0) return <FeatureNudgeChipV2Live feature="Team meetings" daysLeft={8} onDismiss={NOOP} />;
      const label = ['', 'Sharing to a team', 'AI actions on shared meetings', 'Workspace integrations'][s];
      const iconName = ['', 'share2', 'sparkles', 'plug'][s];
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', color: 'var(--fg-1)', border: '1px solid var(--border-strong)', padding: '11px 15px', borderRadius: 12, fontSize: 13, fontWeight: 500, boxShadow: 'var(--shadow-v2-lg)' }}>
          <span style={{ color: 'var(--green-600)', display: 'inline-flex' }}><Icon name={iconName} size={15} /></span>
          {`${label} is a Grain Business feature: 8 days left in your trial.`}
        </div>
      );
    },
  },
  {
    tag: 'H9',
    title: 'Teammate engagement nudge',
    trigger: 'A teammate’s first meeting is captured in the trial workspace.',
    kind: 'inline',
    render: () => <TeammateNudgeV2Live name="Maya Chen" avatarSrc={mayaPhoto} daysLeft={8} onView={NOOP} onClose={NOOP} />,
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
  {
    tag: 'C',
    title: 'Inline settings upgrade',
    trigger: 'Beside a locked setting/plan row — Bot capture, Templates, Billing.',
    kind: 'inline',
    states: ['Button', 'Link'],
    render: (s) => (
      <div style={{ width: 560, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <span>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>Bot display settings</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-5)', marginTop: 2 }}>Customize how the Grain Bot appears and behaves in meetings.</div>
          </span>
          {s === 1
            ? <span style={{ fontSize: 13, color: 'var(--fg-4)' }}>Only auto-capture if I am the event organizer <InlineUpgradeV2Live variant="link" onUpgrade={NOOP} /></span>
            : <span style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn-v2 btn-v2--secondary iu-v2__btn" onClick={NOOP}>Customize</button>
                <InlineUpgradeV2Live variant="button" onUpgrade={NOOP} />
              </span>}
        </div>
      </div>
    ),
  },
  {
    tag: 'D',
    title: 'Locked menu item (upgrade pill)',
    trigger: 'A Business-only action in a menu — Send to HubSpot / Salesforce / Slack.',
    kind: 'inline',
    render: () => (
      <div style={{ width: 260, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: 6, boxShadow: 'var(--shadow-v2-md)' }}>
        {[
          { label: 'Send to Slack', locked: false },
          { label: 'Send to HubSpot', locked: true },
          { label: 'Send to Salesforce', locked: true },
        ].map((r) => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 10px', borderRadius: 8, color: r.locked ? 'var(--fg-5)' : 'var(--fg-1)', fontSize: 14 }}>
            <span>{r.label}</span>
            {r.locked && <UpgradeBadgeV2Live onClick={NOOP} />}
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: 'E',
    title: 'Media-player locked overlay',
    trigger: 'On the recording player when the recording is over the free limit or locked.',
    kind: 'inline',
    states: ['Limit reached', 'Locked'],
    render: (s) => (
      <div style={{ position: 'relative', width: 480, height: 270, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg, #2b2f36, #1a1d22)' }}>
        <MediaLockOverlayV2Live kind={s === 1 ? 'locked' : 'limit'} onUpgrade={NOOP} />
      </div>
    ),
  },
  {
    tag: 'H5b',
    title: 'Invite to collaborate',
    trigger: 'States B/C/D/E — clicking Invite. Inviting grants workspace access + collaboration (requires trial); a view-only link is always offered. Trial is provisioned before the invite.',
    kind: 'modal',
    states: ['In-domain', 'External', 'Trial over'],
    render: (s) => (
      <InviteUpsellModalV2Live
        open
        workspace="Acme"
        userDomain="acme.com"
        state={s === 2 ? 'trial-over' : 'free'}
        seedEmail={s === 1 ? 'jordan@quest.io' : 'devon@acme.com'}
        onClose={NOOP}
        onViewLink={NOOP}
        onPrimary={NOOP}
        onLearnMore={NOOP}
      />
    ),
  },
  {
    tag: '#12',
    title: 'Locked recording (inline)',
    trigger: 'Opening a locked recording — inline card in the record body (sibling of H3).',
    kind: 'inline',
    render: () => (
      <div style={{ width: 560, background: '#fff', borderRadius: 10, padding: '48px 24px' }}>
        <LockedRecordingCardV2Live onStartTrial={NOOP} />
      </div>
    ),
  },
];

// "View in prototype" targets, keyed by hook title. Only hooks with a real
// in-context home get a link; the rest stay gallery-only (see handoff notes).
const VIEW_CONTEXT: Record<string, HookEntry['context']> = {
  'History approaching 30-day lock': { route: '/' },
  'Locked meeting (past 30 days)': { route: '/', show: 'locked' },
  'Share link (view-only)': { route: '/', show: 'share' },
  'Share with a message (Business)': { route: '/', tweaks: { trialActive: true }, show: 'bizShare' },
  'Invite to collaborate': { route: '/', show: 'inviteForm', tweaks: { paidOrgOnDomain: false, emptyDomain: false } },
  'Feature / integration upgrade gate': { route: '/integrations', tweaks: { plan: 'free' } },
  'Plans / pricing modal': { route: '/', show: 'plans' },
  'Trial expired: interstitial': { route: '/', tweaks: { trialOver: true } },
  'Trial-ended widget (grace countdown)': { route: '/', tweaks: { trialOver: true } },
  'Teammate engagement nudge': { route: '/', tweaks: { teammateNudge: true } },
  'Trial countdown widget': { route: '/', tweaks: { trialActive: true } },
  'Trial countdown popup': { route: '/', tweaks: { trialActive: true }, show: 'trialPopup' },
  'Inline settings upgrade': { route: '/settings' },
  'Media-player locked overlay': { route: '/record', tweaks: { state: 'limit' } },
  'Locked recording (inline)': { route: '/record', tweaks: { state: 'locked-card' } },
  'Locked menu item (upgrade pill)': { route: '/record', tweaks: { actionsOpen: true, state: 'normal' } },
};
HG_HOOKS.forEach((h) => { if (VIEW_CONTEXT[h.title]) h.context = VIEW_CONTEXT[h.title]; });
