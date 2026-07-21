# Handoff — integrating the trial/upsell hooks into the Grain app

**Audience:** the Claude agent working in the real Grain repo.
**Goal:** port the hook gallery **and** the in-context *behavior* of every trial/upsell
hook out of this standalone prototype and into the local Grain app — driven by a
demo/prototype state layer and **populated with fake data** (no real recordings needed).

This prototype currently lives at `spacebearvolta/newmodel`, branch
`claude/hook-patterns-touchpoints-vr1gh8`, in the `app/` subdirectory (Vite + React + TS).
Do the integration on a **new branch in the Grain repo** (see §7).

---

## 0. Design-system authority (READ FIRST — this overrides everything below)

**The Grain app's own `design.md` and its real button/component styles are the single source
of truth. Where the prototype and Grain's design system disagree, Grain wins — always.**

This prototype was built with its **own throwaway styling** to move fast. Those styles must
**not** survive the port. Concretely:

- **Do not carry over the prototype's button classes.** They are prototype-local and have no
  standing in Grain: `btn-v2`, `btn-v2--dark`, `btn-v2--primary`, `btn-v2--secondary`,
  `btn-v2--ghost`, `btn-v2--warn`, `btn-v2--lg`, `btn-v2--full`; `gr-btn` and its `--primary /
  --dark / --outline / --ghost / --sm / --md / --lg`; `up-plan__btn--*`; `ms-join`, `ms-unlock`,
  etc. **Replace every one** with Grain's canonical button component/variants as defined in
  `design.md`. Same for inputs, chips, cards, modals, toasts, and tokens.
- **Reconcile tokens to Grain's.** The prototype's `styles/tokens.css` (colors, radii, shadows,
  spacing) is a stand-in. Map each usage to Grain's real design tokens; delete the prototype
  tokens. Don't ship the prototype's ad-hoc hex values.
- **Preserve intent, not implementation.** What must survive is the *semantic role* of each
  control, not its prototype CSS:
  - "Start trial" = the **dark / team-icon** primary action.
  - "Upgrade" = the **green / gem-icon** primary action.
  - Secondary/dismiss actions stay secondary ("Maybe later", "Back", "Use Grain by myself").
  Express those roles through Grain's real button variants + Grain's icon set — not the
  prototype's `users`/`gem` hand-drawn Lucide icons or `btn-v2--dark`.

### Grain's current Button system (verify in Storybook before porting)

**Visual source of truth:** the Grain button Storybook — project `grain-button-styles`
(`https://app.netlify.com/projects/grain-button-styles/overview`). Confirm every mapping below
against it. Also work from the **proposed `clients/DESIGN.md` updates** (§6 Button, §7 usage)
with rationale in `developer-docs/button-design-md-change-proposal.md` on that branch.

`Button` (`src/components/ui/button.tsx`) variants — **naming rule: no prefix = neutral,
`brand-` = brand (green):**

`default` · `secondary` · `outline` · `ghost` · `destructive` · `brand` · `brand-secondary` ·
`brand-outline` · `brand-ghost` · `brand-link` · `link`

Intent of the brand-tier variants:
- `brand` — primary brand action (solid green).
- `brand-secondary` — secondary brand action (tonal green).
- `brand-outline` — tertiary brand action; green outline, black label; reads as interactive next
  to a primary (e.g. in modals).
- `brand-ghost` — low-emphasis brand action, borderless.
- `brand-link` — inline brand navigation styled as text.

Hover/press: hover = one step up the scale, pressed = another (`brand`: 600→700→800; tonal
variants via opacity `/10`→`/15`→`/20`). Neutral variants aren't retrofitted yet.

**When to use brand-tier (updated §7 — the old "green = recording only" rule is removed):**
brand variants are appropriate for (a) recording-related CTAs, (b) marketing/conversion moments
that need brand personality, and (c) clickability signals where black doesn't read as
interactive (e.g. `brand-link`). Most trial/upsell hooks here are conversion moments → brand-tier
is in-scope; choose the emphasis level (`brand` / `brand-secondary` / `brand-outline` /
`brand-ghost` / `brand-link`) by the action's role in its surface.

### Prototype → Grain Button map (starting point — confirm in Storybook)

| Prototype class / control | Role in prototype | Grain `Button` variant |
|---|---|---|
| `btn-v2--primary`, `gr-btn--primary`, `up-plan__btn--primary` (green **Upgrade**, gem) | primary brand CTA | `brand` |
| `btn-v2--dark`, `gr-btn--dark` (**Start trial**, black, team icon) | primary CTA | **decide:** `default` (neutral black, keeps trial ≠ upgrade contrast) **or** `brand` if you want it green. **Flag to user.** |
| `btn-v2--secondary`, `up-plan__btn--neutral` | secondary/tonal | `secondary` (or `brand-secondary` if it's a brand action) |
| `gr-btn--outline` | tertiary outline | `outline` (or `brand-outline` next to a brand primary) |
| `btn-v2--ghost`, `gr-btn--ghost`, `.tb2__self` ("Use Grain by myself") | low-emphasis dismiss | `ghost` |
| `.gate-v2__link` ("Learn more" → trial value prop), inline "Grain Business" link (H2) | inline brand nav | `brand-link` |
| `ms-join` (green-50 bg / green-700 icon join button) | tonal green control | `brand-secondary` |
| `ms-unlock` (Upgrade on locked rows) | tertiary brand affordance | `brand-outline` |
| `up-plan__btn--disabled` ("Current plan") | disabled current state | `<Button disabled>` (`secondary`/`outline`) |
| `btn-v2--warn` (urgent trial widget CTA, amber) | urgent primary | **no amber variant exists — flag.** Options: `brand` + convey urgency via surrounding UI, or `destructive` if truly a warning. |
| `btn-v2--lg` / `btn-v2--full` / `gr-btn--sm/md/lg` | size / full-width | Grain `size` prop + width utility, **not** a variant |

The one real semantics call is **Start trial (black) vs Upgrade (green)** — in the prototype they're
deliberately different so users can tell "start a trial" from "pay now". Grain's expanded §7 allows
either to be brand. Surface this to the user with the two options above rather than picking silently.

**When something doesn't map cleanly, STOP and ask — don't invent a one-off.**
If a hook's layout, a button variant, an icon, a state color, or a gradient treatment has no
clean equivalent in Grain's design system, do **not** hand-roll a bespoke style to force it in.
Instead, call it out to the user and present **2–3 options that each stay within `design.md`'s
rules**, with a recommendation and the trade-offs. Let the user choose. Examples of likely
mismatches to flag: the amber recording-cap treatment, the bottom-right brand gradient on
Business tiers, the "Works with" logo bank, the row-menu upsell row, and any CTA where
Grain's button system has no dark/gem equivalent.

---

## 1. What this prototype is

A self-contained Vite/React/TS SPA that demonstrates a new account/pricing model for Grain
and every trial/upsell "hook" (touchpoint) that goes with it. Two things live here:

1. **A hook gallery** (`/hook-gallery`) — a dev-review tool that renders each hook, in each
   state, one at a time, with a "View in prototype" deep-link into the real surface.
2. **The hooks in context** — the same hook components wired into a working app shell
   (Meetings, sidebar, Integrations, live recording, settings), so you can see *when* each
   hook fires and *what account state* it belongs to.

**Design principle throughout:** link-sharing is never gated (free, view-only);
collaboration / workspace access requires a trial or upgrade. "Start trial" buttons are
dark with a team (`users`) icon; "Upgrade" buttons are green with a gem icon.

---

## 2. The account-state / tier model (the spine of everything)

All hook behavior is a function of one derived tier state. In the prototype it's computed in
`app/src/components/creator/CreatorApp.tsx`:

```
orgExists   = orgCreated || trialOver || trialActive
orgInactive = trialOver
orgActive   = orgExists && !orgInactive
```

Mapped to product tiers:

| Tier | Condition | What the user sees |
|---|---|---|
| **Free / personal** (solo) | `!orgExists` | Personal Meetings, 45-min cap, 30-day history, view-only sharing. Upsell hooks fire here. |
| **Business trial (active)** | `trialActive` → `orgActive` | Workspace created, full features, a countdown widget, feature-usage nudges. `trialDays` (14→1) drives urgency. |
| **Trial over (org inactive)** | `trialOver` → `orgInactive` | Expired interstitial, grace countdown (`graceDays` 30→1), reactivate/upgrade. Shared meetings locked; the user's own stay. |
| **Paying Business** | `orgCreated` persisted + active; `paidOrgOnDomain` for the "join existing paid org" path | Full workspace, no upsell. `plan: 'business'` in Integrations. |

**Inputs that set the tier** (prototype tweaks / persisted flags):
`trialActive`, `trialOver`, `orgCreated` (localStorage `grain.orgCreated`), `paidOrgOnDomain`,
`trialDays`, `graceDays`, `hasMeetings`, `emptyDomain`, `teammateNudge`.

> For the Grain integration, replace these tweaks with a **DemoState context** (see §5) that
> exposes the same tier + the same knobs, so hook gating logic ports over 1:1.

---

## 3. How hooks are triggered & deep-linked (prototype mechanics)

Three mechanisms, all in `app/src/components/tweaks/TweaksPanel.tsx`:

- **`useTweaks<T>(defaults)`** — seeds state from `?tw=<json>` in the URL and persists;
  the Tweaks panel mutates it. This is the tier/knob source.
- **`readShowParam()`** — reads `?show=<hook>`; on mount, `CreatorApp` maps it to opening a
  specific hook (see its `useEffect`). Values: `share`, `bizShare`, `inviteForm`, `record`,
  `upload`, `locked`, `plans`, `upgrade`, `trial`, `trialPopup`, `toast-share`, `toast-ai`,
  `nudge-teamMeetings`.
- **`buildViewUrl(route, tweaks, show)`** → `?tw=<json>&show=<hook>&app=1` (the gallery's
  "View in prototype" links; `app=1` only for `/`).

**In-app triggers** (the real behavior, wired in `CreatorApp`, `MeetingsSurface`, etc.):
these are ordinary event handlers gated on the tier. Examples:
- `onNew('upload')` → free user → `setRecordLimit('upload')` (H1 upload modal).
- `onRecordAttempt` → free user → navigates to `/live` (H1 recording, inline cap box).
- `onShareAttempt` → **free** → view-only share modal; **orgActive** → Business share modal.
- `onInvite` → **free** → invite-to-collaborate modal (creates trial first); **orgActive** → Business share.
- `onFeatureUse('share'|'ai')` → mid-trial → contextual toast (H8).

---

## 4. The hook catalog — trigger → tier → surface

Tags match the gallery cards (`app/src/data/hooks.tsx`, `HG_HOOKS`). Components live in
`app/src/components/hooksV2/HooksV2Live.tsx` unless noted.

| Tag | Hook | Fires when | Tier | Surface |
|---|---|---|---|---|
| **H1** | Recording length wall | Free user records past 45 min (`/live`) or uploads a file > 45 min | Free | Inline **amber** cut-off box below the live transcript (record); modal (upload) |
| **H2** | History → 30-day lock | Free user has meetings nearing the 30-day history limit | Free (+ has meetings) | Inline banner on My meetings (outline + drop shadow) |
| **H3** | Locked meeting | Free user opens a meeting older than 30 days | Free | Modal |
| **#12** | Locked recording (inline) | Free user opens a locked recording | Free | Inline card in the recording body |
| **E** | Media-player locked overlay | Player opens a recording over-limit / locked | Free | Overlay on the video player |
| **Share** | Share link (view-only) | Free user clicks Share (never gated) | Free | Modal: scope + copy link + "Invite your team" handoff |
| **Share** | Share with a message (Business) | Active workspace clicks Share / kebab→Share | Trial/Business | Modal: recipients + message |
| **Menu** | Meeting-row 3-dots menu | Any user clicks the ⋮ on a row | All | Dropdown; Copy-link toast for all; Share routes by tier; free users see gated items + a "Try Grain Business / 14 day trial" upsell |
| **H5b** | Invite to collaborate | Free user clicks Invite (trial is provisioned first) | Free → trial | Modal (in-domain / external / trial-over states) |
| **H6** | Feature/integration gate | Free user opens a locked feature or integration (`/integrations`) | Free | Centered gate card; "Learn more" → Start-trial value prop |
| **C** | Inline settings upgrade | Beside a locked setting row | Free | Inline button/link |
| **D** | Locked menu item (pill) | A Business-only action in a menu | Free | Upgrade pill |
| **Plans** | Plans / pricing modal | Any "see plans" entry point | Any | 3-column modal (`PlansModalV2Live`) |
| **Upgrade** | Upgrade your plan modal | The Upgrade CTA (sidebar widget, locked rows, trial popup) | Free/trial | `UpgradePlanModal` in `components/upgrade/UpgradeModal.tsx` (+ Checkout, + reactivate variant) |
| **Trial** | Start-trial value prop | "Start trial" CTAs & "Learn more" on any gate | Free | Marketing modal (`TrialBentoStep` in `FlowCreatorSteps.tsx`) |
| **Trial** | Trial countdown widget | Throughout the active trial | Trial (active) | Persistent sidebar card; `trialDays` drives urgency ≤ 3 |
| **Trial** | Trial countdown popup | Milestone days in the trial | Trial (active) | Modal from the pill/widget |
| **H8** | Feature-usage nudge | Mid-trial use of a Business feature | Trial (active) | Persistent chip (Team meetings) + toasts (sharing / AI / integrations) |
| **H9** | Teammate engagement nudge | A teammate's first meeting is captured in the trial workspace | Trial (active) | Bottom-right card |
| **H7** | Trial expired: interstitial | First login after the trial ends | Trial over | Non-dismissable modal |
| **H7** | Trial-ended widget (grace) | After the trial ends, through the grace period | Trial over | Persistent sidebar card; `graceDays` ≤ 7 shows deletion countdown |

Copy for every hook/state is catalogued in `COPY-PASS-TEMPLATE.md` (repo root) — use it as the
source of truth for strings.

---

## 5. Sidebar & Tweaks-panel behavior per state

The **sidebar** (`app/src/components/shell/Sidebar.tsx`) and the surfaces swap by tier:
- Free → "Work with your team" promo card + "Start trial".
- Trial active → **Trial countdown widget** (`TrialWidgetV2Live`).
- Trial over → **Trial-ended card** (`TrialEndedCardV2Live`) with grace countdown; an expired
  bar across Meetings; locked shared rows.
- Meetings header shows a trial pill during the active trial.

The **Tweaks panel** (`app/src/components/AppShell.tsx`) is the dev control surface. Its knobs
are the tier inputs from §2 plus presentation toggles (Mac chrome, onboarding). **In the Grain
app, port this as a dev-only "Prototype" panel** bound to the DemoState context — same knobs,
same labels — so a reviewer can flip tier/state and watch hooks + sidebar update live.

---

## 6. Fake data — the essential part

There is **no backend**. Data is static + local:

- **Seed data:** `app/src/data/meetings.ts` — `USER`, `DOMAIN_PEERS`, `EXISTING_PAID_ORG`,
  `MS_UP_NEXT`, `MS_MINE_GROUPS`, `MS_ALL_SHARED`, `MS_OLDER_LOCKED`, `PERSONAL_MEETINGS`,
  view definitions, `MS_MY_MEETING_COUNT`, `orgNameFromDomain()`.
- **Persistence (localStorage):** `grain.orgCreated`, `grain.orgName`, `grain.onboarded`,
  `grain.trialSeen`, `grain.skipOnboarding`, `grain.freshFromOnboarding`, `grain.enteredApp`.
- Hook visibility is then pure derivation from tier + local component state — no fetching.

**Recommended approach for the Grain app** (pick based on how Grain fetches data):

1. **If Grain fetches from an API (REST/GraphQL):** stand up a **fake backend with MSW
   (Mock Service Worker)**, enabled only in a `prototype` build/mode. Seed its handlers from a
   ported `demo-seed.ts` (the arrays above, reshaped to Grain's real API response types).
   Components fetch normally; MSW returns fake meetings/users/workspace/plan. Tie the seed to
   the DemoState tier so "trial over" locks shared meetings, "free" caps history at 30 days,
   etc. **This is the cleanest way to populate the real app without recording anything.**
2. **If Grain reads from a client store (Redux/Zustand/React Query cache):** provide a
   `seedDemoStore(tier)` that hydrates the store with the fake data for the selected tier;
   no network needed.
3. Either way, expose a **DemoState context** (`{ tier, trialDays, graceDays, hasMeetings,
   … , setTier() }`) that (a) selects which seed to load and (b) is what every hook's gating
   reads — replacing `useTweaks`/`readShowParam`.

Keep all of this behind a build flag / env (`GRAIN_PROTOTYPE=1` or a `?prototype` route) so it
never ships to production.

---

## 7. Integration plan (concrete steps)

1. **New branch in the Grain repo** off the default branch, e.g. `feat/trial-upsell-hooks`.
2. **Port the hook components — re-skinned to Grain's design system (§0).** Bring over the
   *structure and behavior* of `HooksV2Live.tsx`, `UpgradeModal.tsx`, `TrialBentoStep`/gate
   pieces from `FlowCreatorSteps.tsx`, and `HookGallery.tsx` — but rebuild every button, input,
   chip, card, and modal with Grain's canonical components per `design.md`. **Do not** copy the
   prototype's `btn-v2*` / `gr-btn*` / `up-plan__btn*` classes or its `styles/tokens.css`;
   map them to Grain's real button variants and tokens. Replace the hand-rolled `Icon` with
   Grain's icon set. Anything that won't map cleanly → flag it and offer options (§0), don't
   hand-roll.
3. **Add the DemoState context + seed** (§6). Reshape `data/meetings.ts` into Grain's real
   entity types. Wire MSW (or the store seeder).
4. **Gate the hooks on tier.** Recreate the derivations from §2 and the trigger wiring from §3
   against Grain's real surfaces (Meetings list, sidebar, share menu, integrations, recorder).
   The 3-dots menu, share/invite routing, and the record/upload cap are the highest-value
   in-context behaviors.
5. **Port the dev Tweaks/Prototype panel** (§5), bound to DemoState.
6. **Mount the gallery** at a dev route (`/hook-gallery`) that renders `HG_HOOKS`.
7. **Verify** each hook in context per the catalog (§4) and the copy per `COPY-PASS-TEMPLATE.md`.

### File manifest (prototype → port these)
```
app/src/components/hooksV2/HooksV2Live.tsx      # every hook component
app/src/components/HookGallery.tsx              # gallery viewer
app/src/data/hooks.tsx                          # HG_HOOKS: triggers, states, contexts, deep-links
app/src/data/meetings.ts                        # fake seed data (reshape to real types)
app/src/components/creator/CreatorApp.tsx       # tier derivation + trigger wiring (reference)
app/src/components/creator/FlowCreatorSteps.tsx # TrialBentoStep (start-trial value prop) + gates
app/src/components/meetings/MeetingsSurface.tsx # meeting list, row 3-dots menu, up-next, banners
app/src/components/record/LiveRecordApp.tsx     # /live recording surface + 45-min cap box
app/src/components/integrations/IntegrationsApp.tsx # H6 feature/integration gate
app/src/components/upgrade/UpgradeModal.tsx     # Upgrade + Checkout + reactivate
app/src/components/shell/Sidebar.tsx            # tier-dependent sidebar cards
app/src/components/tweaks/TweaksPanel.tsx       # useTweaks/readShowParam/buildViewUrl (→ DemoState)
app/src/components/AppShell.tsx                 # Tweaks panel layout + tier inputs (→ Prototype panel)
app/src/redesign/redesign.css, app/src/styles/{meetings,shell,tokens}.css
COPY-PASS-TEMPLATE.md                           # canonical copy for all hooks/states
```

### Routes present in the prototype
`/` (app), `/onboarding`, `/settings`, `/integrations`, `/org-admin`, `/record`, `/live`,
`/hook-gallery`, `/trial-emails`.

---

## 8. Open decisions for the Grain team

- **Design-system authority (§0):** Grain's `design.md` + button styles win. Flag every place
  the prototype doesn't map cleanly and bring the user options that follow `design.md` — never
  a bespoke one-off.
- **Which data layer** does Grain use → picks MSW vs. store-seeder (§6).
- **Reappearance / dismissal cadence** for H2, H8 toasts, H9, trial popup — flagged as TBD in
  `COPY-PASS-TEMPLATE.md` rules; confirm before wiring persistence.
- **Terminology:** "team" in general UI, "organization" only in admin/settings/pricing/creation.
- Several share/invite/trial strings are still `TODO-copy` — treat the copy pass as the input.

---

_Prototype branch: `claude/hook-patterns-touchpoints-vr1gh8` · live demo:
https://newmodelhooks.netlify.app · copy worksheet: `COPY-PASS-TEMPLATE.md`._
