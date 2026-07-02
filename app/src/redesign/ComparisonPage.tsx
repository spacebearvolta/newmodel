// ComparisonPage.tsx — before/after mockup for Alex to react to before any
// baseline component changes. "Before" reuses the exact production render
// functions from data/hooks.tsx untouched; "After" is the v2 exploration.
import type { ReactNode } from 'react';
import { HG_HOOKS } from '../data/hooks';
import {
  RecordingLimitModalV2, HistoryLockBannerV2, LockedMeetingModalV2, TeamValueModalV2,
  HgGateCardV2, TrialExpiredInterstitialV2, TrialEndedCardV2, FeatureNudgeChipV2,
  TeammateNudgeV2, TrialWidgetV2, TrialCountdownV2,
} from './HooksV2';

// position:fixed descendants (the Modal scrim) contain to this frame instead
// of escaping to the viewport, because a transform creates a containing
// block. Modal-kind hooks need an explicit (non-auto) height for that
// contained scrim to size against — an out-of-flow child can't establish
// its ancestor's auto height, so without this the frame collapses to 0.
function Frame({ children, dark, tall }: { children: ReactNode; dark?: boolean; tall?: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        [tall ? 'height' : 'minHeight']: tall ? 680 : 180,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background: dark ? '#0B0E13' : '#F3F2EE',
      }}
    >
      {children}
    </div>
  );
}

interface Row {
  tag: string;
  title: string;
  note: string;
  before: ReactNode;
  after: ReactNode;
  beforeDark?: boolean;
  tall?: boolean;
}

const ROWS: Row[] = [
  {
    tag: 'H1', title: 'Recording length wall',
    note: 'Radius 16→10px, pill buttons→rectangular (no icon on the CTA), single full-width primary + plain text secondary (Loom\'s single-strong-CTA pattern) instead of two co-equal pills. Top icon mark removed entirely (was clock, blue then green) — top padding tightened and the title\'s top margin dropped so removing it doesn\'t leave a gap. 3rd value bullet reworded; "record" → "capture" in subcopy.',
    before: HG_HOOKS[0].render(0), beforeDark: true, tall: true,
    after: <RecordingLimitModalV2 kind="record" />,
  },
  {
    tag: 'H2', title: 'History approaching 30-day lock',
    note: 'Neutral gray alert → green-tinted bar (Loom\'s "1 of your viewers" banner treatment). CTA button removed — "Grain Business" in the body copy is now the hyperlink (reviving a link treatment the original CSS had but never used).',
    before: HG_HOOKS[1].render(0),
    after: <HistoryLockBannerV2 daysLeft={5} />,
  },
  {
    tag: 'H3', title: 'Locked meeting (past 30 days)',
    note: 'Same rectangular-button (no icon) + radius cleanup as H1. Top icon mark (lock) removed too, same padding/margin tightening to avoid a gap where it used to sit.',
    before: HG_HOOKS[2].render(0), beforeDark: true, tall: true,
    after: <LockedMeetingModalV2 />,
  },
  {
    tag: 'H4 · H5', title: 'Invite / Share value modal',
    note: 'Added a Grain-green gradient border (Loom\'s highlighted-plan-card treatment, in brand color instead of their purple/pink). Eyebrow tag lost its icon entirely (no logo stand-in per Alex — nothing until the real file arrives) and its text is now black instead of green. Preview panel now fills with 7 real meeting titles at a fixed height with a bottom fade, so the last one cuts off mid-card implying more below — same mask technique the original placeholder version used. Buttons stacked and centered, not side-by-side; no icon on the CTA.',
    before: HG_HOOKS[3].render(0), beforeDark: true, tall: true,
    after: <TeamValueModalV2 trigger="invite" />,
  },
  {
    tag: 'H6', title: 'CRM connection gate',
    note: 'Same rectangular-button (no icon) + radius cleanup. Eyebrow tag moved from the top to below the CTA, lost its icon, and is now plain gray text with no background. HubSpot mark is an approximation (no real asset available yet) — orange background kept since it represents HubSpot, not Grain.',
    before: HG_HOOKS[4].render(0), beforeDark: true,
    after: <HgGateCardV2 />,
  },
  {
    tag: 'H7', title: 'Trial expired — interstitial',
    note: 'Restructured into the same two-column pattern as H4/H5: left column keeps the existing headline/subcopy/value-bullet info, right column is a "Team meetings" preview that fills and fades the same way H4/H5\'s does. Rows are ordered by urgency, soonest-to-lock first ("locking in 5 days" leads), already-locked/oldest last. Subcopy turns red only for: over 45 min, OR locking in under 7 days, OR already past 30 days — a merely-long wait like "locking in 12 days" stays gray. Top icon mark and the separate "Saved for X days" banner are both gone. Buttons stacked, Upgrade now on top, "Continue with free account" as a plain link underneath.',
    before: HG_HOOKS[5].render(0), beforeDark: true, tall: true,
    after: <TrialExpiredInterstitialV2 orgName="Acme" graceDays={30} />,
  },
  {
    tag: 'H7', title: 'Trial-ended widget (grace countdown)',
    note: 'Upgrade icon → gem (matches the unified motif). Card radius 14→10px.',
    before: HG_HOOKS[6].render(0),
    after: <TrialEndedCardV2 orgName="Acme" graceDays={30} />,
  },
  {
    tag: 'H8', title: 'Feature-usage nudge',
    note: 'Purple restored per Alex — "make this banner purple like it used to be," reverting last round\'s move to a green tint. Icon is still feature-specific: users / share2 / plug per feature, and sparkles specifically for the AI-actions state (per the rule: sparkles = AI only, not a general "Grain Business" mark).',
    before: HG_HOOKS[7].render(2),
    after: <FeatureNudgeChipV2 feature="AI actions on shared meetings" daysLeft={8} />,
  },
  {
    tag: 'H9', title: 'Teammate engagement nudge',
    note: 'Layout reverted to match the original: avatar on the left with the eyebrow stacked above the title beside it, vertically centered against the avatar (was top-aligned, which read as too high). Eyebrow copy simplified to just "X days left in trial" with a clock icon — "Your trial is working" is gone. Title widened to fit on one line. Body copy names the meeting explicitly but no longer repeats the trial countdown at the end — that lives in the eyebrow only. CTA is now a dark/black button, not green. Buttons renamed: Dismiss → "Not now", "See the meeting" → "View meeting summary". Avatar still shows initials — pending Maya\'s actual photo as a real file upload (came through as a pasted image again, not a file).',
    before: HG_HOOKS[8].render(0),
    after: <TeammateNudgeV2 name="Maya Chen" daysLeft={8} />,
  },
  {
    tag: 'Trial', title: 'Trial countdown widget',
    note: 'Badge icon → clock (not the Grain logo, per direction — this badge specifically stays icon-only), and its color corrected from orange to green. Card background/border reverted to the original green gradient + green outline treatment. Upgrade CTA icon → gem, rectangular button.',
    before: HG_HOOKS[9].render(0),
    after: <TrialWidgetV2 daysLeft={14} />,
  },
  {
    tag: 'Trial', title: 'Trial countdown popup',
    note: 'Hero reverted to the original hub-and-spoke treatment exactly — the first redesign pass had flattened it to a plain gradient + badge, which was a regression. The close (X) button, dropped in that same pass, is back in the top-right corner. Buttons went rectangular.',
    before: HG_HOOKS[10].render(0), beforeDark: true, tall: true,
    after: <TrialCountdownV2 daysLeft={8} orgName="Acme" />,
  },
];

export function ComparisonPage() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px' }}>
      <h1 style={{ font: '700 28px/1.2 var(--font-display)', color: 'var(--fg-1)', marginBottom: 6 }}>
        Hook redesign — before / after
      </h1>
      <p style={{ color: 'var(--fg-5)', fontSize: 14, marginBottom: 36, maxWidth: 720 }}>
        Grain green stays the primary accent. Buttons move to DESIGN.md's rectangular 8px radius (no more pills,
        no icons on CTAs). Sparkles is reserved for AI-specific moments only — the invented starburst mark turned
        out to read as Claude's mark, not Grain's, so it's gone; eyebrow tags use the real grain-logo.png as a
        stand-in until Alex shares Grain's actual logo file. Layout cues borrowed from the Loom/Grain reference
        screenshots, using only Grain colors and components. These are mockups, not final code — nothing here is
        wired into the real Hook Gallery yet.
      </p>
      {ROWS.map((row) => (
        <section key={row.title} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ font: '700 11px var(--font-sans)', letterSpacing: '.04em', color: 'var(--green-600)' }}>{row.tag}</span>
            <h2 style={{ font: '600 17px var(--font-sans)', color: 'var(--fg-1)', margin: 0 }}>{row.title}</h2>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--fg-5)', lineHeight: 1.5, margin: '0 0 14px', maxWidth: 900 }}>{row.note}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-5)', marginBottom: 6 }}>BEFORE</div>
              <Frame dark={row.beforeDark} tall={row.tall}>{row.before}</Frame>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green-600)', marginBottom: 6 }}>AFTER</div>
              <Frame tall={row.tall}>{row.after}</Frame>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
