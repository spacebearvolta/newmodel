# Handoff: Grain trial-hooks prototype → visual design pass

## What this doc is for
This prototype (start here: **`Meetings.html?app`**) has a full, working set of
"upgrade hooks" — moments where a free or trial user hits a plan limit and is
invited toward Grain Business. All of them are **built, wired to real triggers,
and functionally verified**. What they are NOT yet is *visually developed* —
they were built directly on existing DS primitives (Modal, btn, Icon) with no
distinct visual treatment, so today they look generic/interchangeable rather
than like an intentional, ownable "growth moment" pattern.

**The next stage of work is a visual design language for these moments** —
using a brand design brief + reference examples that will be shared in the new
chat. This doc is the functional/technical map so that work can start
immediately without re-discovering the prototype.

## How to see everything in one place
Open **`Meetings.html?app`**, turn on **Tweaks** (toolbar), and click
**▶ Hook gallery** at the top of the panel ("Review" section). It's a
slideshow of every hook below, each with state variants (e.g. grace-day
counts, invite vs. share) and its trigger description. This is the fastest
way to audit all of them side by side. Source: `HookGallery.jsx`.

## The persona / state model (how to reach each hook live)
The prototype has two entry personas from the reset screen:
- **"Use Grain by myself"** → free/solo user (`StartTrialApp`, `mode="solo"`)
- **"Create an org"** → trial creator/admin (`StartTrialApp`, `mode="org"`)

State is driven by the Tweaks panel (`Meetings.html`'s inline `<script>`,
`DEFAULTS` object) — key ones: `hasMeetings`, `trialOver`, `graceDays`,
`teammateNudge`, `mcpFirstMeetingBanner`, `paidOrgOnDomain`.

## Hook inventory (all built)

**Free / solo plan limits**
- **H1 — Recording/upload 45-min wall.** Blocking modal. Fires from + New →
  record/upload, or an Up-next Join button. Component: `RecordingLimitModal`
  in `TrialHooks.jsx`.
- **H2 — 30-day history approaching.** Ambient dismissible banner atop My
  meetings. Component: `HistoryLockBanner` in `TrialHooks.jsx`.
- **H3 — Locked meeting (past 30 days).** Click a locked row → explainer
  modal. Component: `LockedMeetingModal` in `TrialHooks.jsx`.
- **H4 / H5 — Invite / Share value modal.** One component, parameterized.
  Fires from sidebar Invite button or a meeting row's share kebab. Includes a
  dimmed "team workspace" preview mockup. Component: `TeamValueModal` in
  `TrialHooks.jsx`.
- **H6 — CRM connection gate.** Profile → Integrations → any CRM row while on
  free plan shows a gated upgrade card (brand logo, value list, dark CTA).
  Lives in `IntegrationsSettings.jsx` (loaded by `Integrations.html`), NOT in
  `TrialHooks.jsx`. Free tier = zero CRM connections (status quo, confirmed
  with Alex).

**Post-trial (after Business trial ends)**
- **H7 — Trial-expired interstitial.** Full-screen, shown once on first login
  post-expiry. "Upgrade now" (dark) / "Continue with free account" (outline).
  Component: `TrialExpiredInterstitial` in `TrialHooks.jsx`.
- **H7 (companion) — Trial-ended sidebar widget.** Persistent card in the
  sidebar (replaces a separate banner that was removed as redundant) —
  carries a deletion countdown in the final 7 grace days. Component:
  `TrialEndedCard` in `FlowCreator.jsx`.

**Mid-trial (Business trial active)**
- **H8 — Feature-usage nudge.** Non-blocking. Rendered as an inline chip
  (Team-meetings tab) or a toast (after sharing / AI action / integration
  use). Component: `FeatureNudgeChip` in `TrialHooks.jsx`; toast text fired
  from `onFeatureUse` in `FlowCreator.jsx`. Also a chip variant in
  `IntegrationsSettings.jsx` for the Business-trial state.
- **H9 — Teammate engagement nudge.** Bottom-right card, auto-fires ~2.5s
  after landing in an active-trial org (or forced via the `teammateNudge`
  tweak). Component: `TeammateNudge` in `TrialHooks.jsx`.
- **Trial countdown widget + popup** (pre-existing, not part of H1–H9 but
  part of the same visual family): `TrialCountdown.jsx`.

**Email**
- `Trial Emails.html` + `EmailMocks.jsx` — designed email mockups for H7
  (trial-ended) and H9 (teammate captured), switchable via Tweaks. These were
  styled independently of the in-app hooks and don't yet share a visual system
  with them either.

## Where the visual language currently comes from
Everything above reuses the base DS tokens/components with no new visual
identity:
- `Modal` / `.scrim` (from `OrgShell.jsx`) for all blocking states
- `.btn--dark` / `.btn--ghost` / `.btn--pill` for CTAs
- A repeated "green check-circle value list" pattern (`.hook-values`) —
  the closest thing to a recurring motif, but it's plain and under-designed
- One accent color used loosely: green for eyebrows/checkmarks, a flat
  `#EAF1FB` blue tile for H1's icon mark, purple (`#6D45E8`/`#F3F0FF`) for H8
  chips — **three unrelated accent colors, no unified system**
- All styles for these hooks live in **`meetings-surface.css`**, in the
  section headed `/* Free-plan upgrade hooks (TrialHooks.jsx) */` and
  `/* POST-TRIAL HOOKS (H7–H9) */` and `/* HOOK GALLERY */`. Also see
  `.intg-card`/`.intg-trial-chip`/`.intg-values` styles inside
  `Integrations.html`.

This is exactly the "bland/boring/not thought through" gap Alex flagged —
there's no consistent iconography, illustration, motion signature, or color
system that says "this is a Grain growth moment" at a glance across a modal,
a toast, a chip, a sidebar card, and an email.

## File map (for the next chat to jump straight in)
- `Meetings.html` — shell/host page, Tweaks defaults, mounts `StartTrialApp`
  and `<HookGallery>`
- `FlowCreator.jsx` — the org/trial persona app (`StartTrialApp`), owns most
  hook trigger wiring + state (recordLimit, lockedMeeting, teamValue,
  expiryDismissed, teammateAuto, etc.) and `TrialEndedCard`
- `MeetingsSurface.jsx` — meetings list/rows; hosts the click targets for H1
  (join), H3 (locked row), H5 (share kebab), H8 (team-meetings chip slot,
  AI-ask pill), and `ExpiredBar` (defined but currently unused — see below)
- `OrgShell.jsx` — Sidebar (Invite button, H4 trigger), Modal, Icon primitives
- `TrialHooks.jsx` — **the actual hook components** (H1–H3, H4/H5, H7–H9)
- `TrialCountdown.jsx` — pre-existing trial widget + popup
- `IntegrationsSettings.jsx` / `Integrations.html` — H6 gate + H8 integration
  chip
- `HookGallery.jsx` — reviewer slideshow of all hooks (great place to preview
  new visual designs against every state quickly)
- `EmailMocks.jsx` / `Trial Emails.html` — H7/H9 email mockups
- `meetings-surface.css` — styling for nearly all of the above (search for
  `hook-`, `feature-nudge`, `teammate-nudge`, `trial-expired`, `hg-` prefixes)

## Loose end to flag
`ExpiredBar` (in `MeetingsSurface.jsx`) is fully built (including an
`.is-urgent` deletion-countdown variant) but is currently **not rendered**
anywhere — Alex had it replaced by the sidebar `TrialEndedCard` to avoid
redundancy. It's still in the file/CSS and included in the Hook Gallery's
source list is not — worth deciding whether it's dead code to delete or a
treatment to fold into the new visual language (e.g. as the H8/H9 toast style
instead).

## What's explicitly NOT in scope yet (this is the next stage)
- No unified color/iconography/illustration system for growth moments
- No motion/entrance signature (currently just generic modal fade / card
  slide-up, inconsistent between components)
- No decision on whether modals, toasts, chips, and cards should share a
  visual family (icon marks, corner radius, shadow depth, typography scale)
  or intentionally differentiate by severity (blocking vs. ambient)
- Email visual language is unrelated to the in-app hook visual language
- The Hook Gallery's own chrome (dark stage, bottom card) is a reviewer tool,
  not a shipped surface — but reusing its "spotlight" idea for real empty
  states/onboarding could be worth considering

## Suggested first move in the new chat
Share the brand design brief + reference examples, then do a **visual
exploration pass on 2–3 representative hooks first** (e.g. one blocking modal
like H1, one ambient piece like H8's chip/toast, and the H7 interstitial —
the highest-stakes screen) before rolling the language across all nine, so
Alex can react to direction before full propagation.
