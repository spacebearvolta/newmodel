# Grain hooks — copy pass template

A worksheet for a full copy review of every trial / upsell hook, in every state.
For each hook you'll see **exactly what's live today** plus blank **Proposed** cells to
fill in, followed by the **rules** that govern when/how the hook shows up.

---

## How to use this

1. **Open the gallery:** run the prototype and go to **`/hook-gallery`** (or click
   *▶ Hook gallery* in the Tweaks panel on any screen). Every hook is a card there,
   labelled with the same **tag** used below (H1, H2, Share, Trial, …).
2. **See it in context:** most cards have a **"View in prototype"** link that drops you
   onto the real screen with the hook showing. The route / deep-link is noted under
   **Where** for each hook.
3. **Toggle states:** cards with multiple states have a state switcher; the state names
   below match the switcher labels exactly.
4. **Fill in the sheet:** read the card, find the matching block here, and write your
   revision in the **Proposed** column. Leave a cell blank to mean "no change".
5. **Answer the rules:** the "current" behaviour is noted in _italics_. Confirm it or
   change it.

### Field glossary

| Field | What it is |
|---|---|
| **Preheader / eyebrow** | Small label above the header (often a plan/badge) |
| **Header** | The main headline |
| **Subcopy** | Body / description under the header |
| **Bullets** | Value bullets, if the hook lists them (icon + text each) |
| **Primary CTA** | The main button — shown as `[icon] text` |
| **Secondary CTA** | The lesser button or link — `[icon] text` |
| **Microcopy** | Footnote / fine print under the CTA |

Icons are written in brackets, e.g. `[users]`, `[gem]`, `[share2]`. These map to the
button glyphs in the prototype — flag if you think a glyph should change.

### Rules glossary

- **Trigger** — the exact condition/action that makes the hook appear.
- **Dismissable?** — can the user close it (X / "Maybe later"), and what does closing do?
- **Reappears?** — once dismissed, does it come back? When / how often?
- **Surface** — where it lives (modal, sidebar card, inline banner, toast, menu row).

---

# 1 · Recording & history hooks

## H1 · Recording length wall
**Where:** Gallery card *"Recording length wall"*. View in prototype → **`/live`** (Recording, inline box on the live transcript) · **`/?show=upload`** (Upload, modal).
**Surface:** Recording = inline **amber** cut-off box below the live transcript (centered on web); the web capture bar also turns amber at the cap. Upload = modal.

### State: Recording
| Field | Current copy | Proposed |
|---|---|---|
| Preheader | — | |
| Header | Recording stopped at the 45-minute free limit | |
| Subcopy | Your meeting so far is saved. Start a trial to keep recording and transcribing full-length. | |
| Primary CTA | `[users]` Start free trial | |
| Microcopy | Grain Business · free for 14 days | |

### State: Upload
| Field | Current copy | Proposed |
|---|---|---|
| Header | This recording is longer than 45 minutes | |
| Subcopy | Start a Business trial to upload and transcribe meetings of any length. | |
| Bullets | `[infinity]` No 45-minute recording cap · `[history]` Unlimited meeting history · `[users]` Shared meeting data your whole team can use to stay aligned | |
| Primary CTA | `[users]` Start free trial | |
| Secondary CTA | Maybe later | |

**Rules**
- Trigger: _Recording — a free recording hits the 45-min cap live on the recording page. Upload — a free user uploads a file over 45 min._
- Dismissable? _Recording box: no X (stays in transcript). Upload modal: "Maybe later" closes it._
- Reappears? _Recording box persists for that session; upload modal re-shows on the next over-limit upload._

---

## H2 · History approaching 30-day lock
**Where:** Gallery card *"History approaching 30-day lock"*. View in prototype → **`/`** (banner on My meetings).
**Surface:** Inline banner (outlined card with drop shadow) at the top of My meetings. States: 5 / 3 / 1 days.

| Field | Current copy | Proposed |
|---|---|---|
| Header | Some of your meetings will lock in **{5 / 3 / 1}** day(s) | |
| Subcopy | Free plans keep 30 days of meeting history. **Grain Business** unlocks it forever. | |
| Primary CTA | inline text link "Grain Business" (no button) | |

**Rules**
- Trigger: _A free user has meetings nearing the 30-day history limit._
- Dismissable? _Yes — X on the right._
- Reappears? _Confirm: does it return at the next milestone (5 → 3 → 1) after dismiss?_

---

## H3 · Locked meeting (past 30 days)
**Where:** Gallery card *"Locked meeting (past 30 days)"*. View in prototype → **`/?show=locked`**.
**Surface:** Modal.

| Field | Current copy | Proposed |
|---|---|---|
| Header | This meeting is locked | |
| Subcopy | The free plan only includes 30 days of meeting history. Upgrade to unlock your meeting history, forever. | |
| Primary CTA | Start free trial to unlock | |
| Secondary CTA | Maybe later | |

**Rules**
- Trigger: _A free user opens a meeting older than the 30-day window._
- Dismissable? _Yes — "Maybe later"._
- Reappears? _Re-shows each time a locked meeting is opened._

---

## #12 · Locked recording (inline)
**Where:** Gallery card *"Locked recording (inline)"*. View in prototype → **`/record`** (locked-card state).
**Surface:** Inline card in the recording body (sibling of H3).

| Field | Current copy | Proposed |
|---|---|---|
| Header | This recording is locked | |
| Subcopy | The free plan only includes 30 days of meeting history. Upgrade to unlock your meeting history, forever. | |
| Primary CTA | Start trial to unlock | |
| Microcopy | Included in Grain Business · free for 14 days | |

**Rules**
- Trigger: _Opening a locked recording._
- Dismissable? _No (inline, not dismissable)._
- Reappears? _Persistent while the recording is locked._

---

## E · Media-player locked overlay
**Where:** Gallery card *"Media-player locked overlay"*. View in prototype → **`/record`** (limit state).
**Surface:** Overlay on the video player. States: Limit reached / Locked.

| Field | Current copy (Limit) | Current copy (Locked) | Proposed |
|---|---|---|---|
| Subcopy | Recording limit reached, upgrade to view recording. | This recording is locked, upgrade to view recording. | |
| Primary CTA | `[gem]` Upgrade | `[gem]` Upgrade | |

**Rules**
- Trigger: _Player opens a recording that is over the free limit (limit) or locked (locked)._
- Dismissable? _No._
- Reappears? _Persistent overlay._

---

# 2 · Sharing & inviting

## Share · Share link (view-only)
**Where:** Gallery card *"Share link (view-only)"*. View in prototype → **`/?show=share`**.
**Surface:** Modal. Shown to **free** users clicking Share. _(Marked TODO-copy in code — treat as draft.)_

| Field | Current copy | Proposed |
|---|---|---|
| Header | Share "{meeting title}" | |
| Subcopy | Anyone with the link can view this meeting — they can't edit, comment, or add highlights. | |
| Scope options | Anyone with the link / All workspace members / Only people with access | |
| Copy button | `[link]` Copy link → "Copied" | |
| Collab title | Invite your team | |
| Collab subcopy | Every shared meeting builds one searchable, AI-ready memory for the whole team. | |
| Collab CTA | `[users]` Invite | |

**Rules**
- Trigger: _Free user clicks Share on a meeting (link sharing is never gated)._
- Dismissable? _Yes — X (top right)._
- Reappears? _Opens on demand each time Share is clicked._

---

## Share · Share with a message (Business)
**Where:** Gallery card *"Share with a message (Business)"*. View in prototype → **`/?show=bizShare`** (trial active).
**Surface:** Modal. Shown when **org active / trial active / paying Business** — sharing isn't gated. _(TODO-copy in code.)_

| Field | Current copy | Proposed |
|---|---|---|
| Header | Share "{meeting title}" | |
| Email placeholder | Add people by email / Add another… | |
| Subcopy (line 1) | Members with access can view and edit the recording and highlights. | |
| Subcopy (line 2) | Non-members will receive a link to the recording. | |
| Message default | I recorded a meeting using Grain and shared access with you. Please take a look at the meeting summary and action items. | |
| Primary CTA | `[share2]` Share | |
| Secondary CTA | Back | |

**Rules**
- Trigger: _Clicking Share / the 3-dots → Share on a meeting while the workspace is active._
- Dismissable? _Yes — X and "Back"._
- Reappears? _Opens on demand._

---

## Menu · Meeting-row 3-dots menu
**Where:** Hover any meeting row → click the ⋮ kebab. Present in every user state.
**Surface:** Dropdown menu. Items: Copy link, Share, Add to playlist, Open in Claude, Open in ChatGPT, Copy transcript for AI, Download transcript for AI, Download transcript, Delete meeting.

| Field | Current copy | Proposed |
|---|---|---|
| Copy-link toast (all users) | `[check]` Recording link copied | |
| Free-user upsell row (title) | Try Grain Business | |
| Free-user upsell row (subcopy) | 14 day trial | |
| Share (routes to modal) | Share | |

**Rules**
- Trigger: _Clicking the ⋮ on a meeting row._
- "Copy link" fires the toast for **every** user (link sharing is never gated).
- "Share" opens the state-aware modal: view-only Share for free, Business share for active workspace.
- For **free users**, only Copy link + Share are active; all other items are inactive, and the green "Try Grain Business / 14 day trial" upsell row appears above "Open in Claude". Delete meeting stays active.
- Dismissable? _Click outside to close._

---

## H5b · Invite to collaborate
**Where:** Gallery card *"Invite to collaborate"*. View in prototype → **`/?show=inviteForm`**.
**Surface:** Modal. Shown to **free** users clicking Invite (trial is provisioned before the invite). States: In-domain / External / Trial over. _(TODO-copy in code.)_

### State: In-domain (free)
| Field | Current copy | Proposed |
|---|---|---|
| Preheader | Grain Business • Free for 14 days | |
| Header | Start a Business trial & invite your team | |
| Field label | Email | |
| Placeholder | Enter a teammate's email / Add another… | |
| Grant line | Your team can edit, comment, and search your whole team's AI-ready memory. | |
| Sequencing note | `[info]` Starting your trial creates your workspace — then your invite goes out. | |
| Primary CTA | `[users]` Start trial & invite | |
| Secondary CTA | `[share2]` Send a view-only link | |

### State: External (free, email outside your domain)
| Field | Current copy | Proposed |
|---|---|---|
| _(same as In-domain, plus:)_ | | |
| External note | `[info]` Someone outside {domain} — they'll join as an independent user. | |

### State: Trial over
| Field | Current copy | Proposed |
|---|---|---|
| Preheader | — (none) | |
| Header | Invite to {workspace} | |
| Grant line | Your team can edit, comment, and search your whole team's AI-ready memory. | |
| Primary CTA | `[gem]` Upgrade & invite | |
| Secondary CTA | `[share2]` Send a view-only link | |

**Rules**
- Trigger: _Free user clicks Invite. Collaboration/workspace access requires the trial, so the trial is created first, then the invite goes out._
- Dismissable? _Yes — X (top right)._
- Reappears? _Opens on demand._

---

# 3 · Feature & plan gates

## H6 · Feature / integration upgrade gate
**Where:** Gallery card *"Feature / integration upgrade gate"*. View in prototype → **`/integrations`** (free plan).
**Surface:** Centered card on a settings/integration page. States: Trackers / Coaching / HubSpot / Slack (title + subcopy swap per feature).

| Field | Current copy | Proposed |
|---|---|---|
| Header | Upgrade your plan to access **{Trackers / Coaching}** / connect **{HubSpot / Slack}** | |
| Subcopy (Trackers) | Track and be automatically alerted of key words or phrases in your meetings. | |
| Subcopy (Coaching) | Automate performance scores for effective coaching and personal improvement. | |
| Subcopy (HubSpot) | Skip the manual data entry, auto-sync AI notes to HubSpot Contact and Meeting objects. | |
| Subcopy (Slack) | Send meeting notes, clips, and Trackers captured by Grain to Slack channels. | |
| Primary CTA | `[users]` Start trial | |
| Microcopy | Included in Grain Business · free for 14 days | |
| Secondary CTA | `[ext]` Learn more _(→ start-trial value-prop page)_ | |

**Rules**
- Trigger: _A free user opens a locked feature or integration._
- Dismissable? _No (it's the page content)._
- Reappears? _Persistent while on that feature/integration and on Free._

---

## C · Inline settings upgrade
**Where:** Gallery card *"Inline settings upgrade"*. View in prototype → **`/settings`**.
**Surface:** Inline, beside a locked setting row. States: Button / Link.

| Field | Current copy | Proposed |
|---|---|---|
| Button variant | `Upgrade` (solid button) | |
| Link variant | `Upgrade` (text link) | |

**Rules**
- Trigger: _Beside a locked setting/plan row (Bot capture, Templates, Billing)._
- Dismissable? _No._
- Reappears? _Persistent._

---

## D · Locked menu item (upgrade pill)
**Where:** Gallery card *"Locked menu item (upgrade pill)"*. View in prototype → **`/record`** (actions menu open).
**Surface:** Upgrade pill next to a Business-only action in a menu.

| Field | Current copy | Proposed |
|---|---|---|
| Pill label | Upgrade | |

**Rules**
- Trigger: _A Business-only action appears in a menu (Send to HubSpot / Salesforce / Slack)._
- Dismissable? _No._
- Reappears? _Persistent while on Free._

---

## Plans · Plans / pricing modal
**Where:** Gallery card *"Plans / pricing modal"*. View in prototype → **`/?show=plans`**.
**Surface:** Modal. Three-plan comparison; Business is "Popular".

| Field | Current copy | Proposed |
|---|---|---|
| Modal header | `[upgradeCircle]` Upgrade your plan | |
| Free — tagline | Quick and easy way to use Grain | |
| Free — CTA | Current plan (disabled) / Upgrade | |
| Starter — tagline | For product, design, and research | |
| Starter — CTA | Upgrade | |
| Business — tagline | For sales and customer success | |
| Business — badge | Popular | |
| Business — CTA | `[gem]` Upgrade | |
| Footer | Enterprise customer? → Book a demo | |

**Rules**
- Trigger: _Opened from any "Upgrade your plan" / "see plans" entry point._
- Dismissable? _Yes — X._
- Reappears? _Opens on demand._

---

# 4 · Trial lifecycle

## Trial · Start-trial value prop
**Where:** Gallery card *"Start-trial value prop"*. View in prototype → **`/?show=trial&app=1`**.
**Surface:** Modal — the marketing screen shown from "Start trial" CTAs and the "Learn more" link on any upgrade gate.

| Field | Current copy | Proposed |
|---|---|---|
| Preheader | Grain Business | |
| Header | Try free for 14 days | |
| Subcopy | Turn your whole team's meetings into one searchable, AI-ready memory | |
| Value 1 | `[infinity]` No 45-minute cap — Record and upload meetings of any length. | |
| Value 2 | `[history]` Unlimited history — Every meeting stays yours, forever. | |
| Value 3 | `[users]` One shared library — Your whole team can search every call. | |
| Value 4 | `[plug]` Integrations & API — HubSpot, Salesforce, Slack, MCP, and more. | |
| Works-with label | WORKS WITH (+ HubSpot / Salesforce / Slack / Zapier logos) | |
| Primary CTA | `[users]` Start trial | |
| Secondary CTA | Use Grain by myself | |
| Microcopy | No credit card required | |

**Rules**
- Trigger: _"Start trial" CTAs and the "Learn more" link on any upgrade gate._
- Dismissable? _Yes — X and "Use Grain by myself"._
- Reappears? _Opens on demand._

---

## Trial · Trial countdown widget
**Where:** Gallery card *"Trial countdown widget"*. View in prototype → **`/`** (trial active).
**Surface:** Persistent sidebar card during the active trial. States: 14 / 8 / 5 / 3 / 1 (urgent ≤ 3).

| Field | Current copy | Proposed |
|---|---|---|
| Header (days ≥ 2) | {n} days left | |
| Header (last day) | Last day of trial | |
| Plan label | Grain Business trial | |
| Meta line | Day {n} of 14 | |
| Primary CTA | `[gem]` Upgrade now | |

**Rules**
- Trigger: _Persistent throughout the active Business trial._
- Dismissable? _No (persistent sidebar card)._
- Reappears? _Always present during trial; styling turns urgent at ≤ 3 days._

---

## Trial · Trial countdown popup
**Where:** Gallery card *"Trial countdown popup"*. View in prototype → **`/?show=trialPopup`** (trial active).
**Surface:** Modal, opened from the trial pill/widget at milestones. States: 8 / 3 / 1 days (urgent ≤ 3).

| Field | Current copy | Proposed |
|---|---|---|
| Header (days ≥ 2) | {n} days left on trial | |
| Header (last day) | Last day of your trial | |
| Subcopy (non-urgent) | Every meeting your team records feeds one shared repository the whole team can search. | |
| Subcopy (urgent) | Upgrade before your trial ends to keep {org}'s shared repository — your team's AI memory. | |
| Meta line | Day {n} of 14 · {org} · Grain Business | |
| Primary CTA | `[gem]` Upgrade now | |
| Secondary CTA | Maybe later | |

**Rules**
- Trigger: _Opens from the trial pill/widget at milestone days remaining._
- Dismissable? _Yes — X and "Maybe later"._
- Reappears? _Confirm cadence — once per milestone day?_

---

## H8 · Feature-usage nudge
**Where:** Gallery card *"Feature-usage nudge"*. View in prototype → **`/`** (trial active) for Team meetings; toasts fire on the action. States: Team meetings / Sharing / AI actions / Integrations.
**Surface:** Team meetings = persistent chip on the team tab. Sharing / AI actions / Integrations = toast right after you do the action.

| Field | Current copy | Proposed |
|---|---|---|
| Template | **{feature}** is a Grain Business feature · {n} days left in your trial | |
| Team meetings | `[users]` **Team meetings** … | |
| Sharing | `[share2]` **Sharing to a team** … | |
| AI actions | `[sparkles]` **AI actions on shared meetings** … | |
| Integrations | `[plug]` **Workspace integrations** … | |

**Rules**
- Trigger: _Mid-trial use of a Business feature._
- Dismissable? _Chip: no X currently. Toasts: auto-dismiss (~7s)._
- Reappears? _Confirm: should the toast fire every time the action is used, or throttle?_

---

## H9 · Teammate engagement nudge
**Where:** Gallery card *"Teammate engagement nudge"*. View in prototype → **`/`** (teammate-nudge tweak).
**Surface:** Card (bottom-right) when a teammate's first meeting is captured in the trial workspace.

| Field | Current copy | Proposed |
|---|---|---|
| Preheader | `[clock]` {n} days left in trial | |
| Header | {First name} just captured their first meeting | |
| Subcopy | Every shared meeting builds one searchable, AI-ready memory for the whole team. | |
| Primary CTA | View meeting summary | |
| Secondary CTA | Not now | |

**Rules**
- Trigger: _A teammate's first meeting is captured in the trial workspace._
- Dismissable? _Yes — X and "Not now"._
- Reappears? _Confirm: once per teammate?_

---

## H7 · Trial expired: interstitial
**Where:** Gallery card *"Trial expired: interstitial"*. View in prototype → **`/`** (trial over).
**Surface:** Non-dismissable modal, shown once on first login after the trial ends.

| Field | Current copy | Proposed |
|---|---|---|
| Header | Your Grain Business trial has ended | |
| Subcopy | Upgrade to turn your team's meetings into shared knowledge. | |
| Bullet 1 | `[video]` **Unlimited recordings**, transcripts, and AI notes with no time or storage limits. | |
| Bullet 2 | `[workflow]` Automate your CRM updates with **CRM integrations** and AI insight property mapping. | |
| Bullet 3 | `[users]` Automatically organize and share meetings with the right people using **Teams**. | |
| Bullet 4 | `[plug]` Make every meeting available to your AI through **advanced MCP access** and the Workspace API. | |
| Bullet 5 | `[sparkles]` Improve your team meetings with **AI coaching**, Trackers, and Scorecards. | |
| Primary CTA | `[gem]` Upgrade | |
| Secondary CTA | Remain on Free | |

**Rules**
- Trigger: _First login after the Business trial ends._
- Dismissable? _No (non-dismissable) — user must pick Upgrade or Remain on Free._
- Reappears? _Shown once._

---

## H7 · Trial-ended widget (grace countdown)
**Where:** Gallery card *"Trial-ended widget (grace countdown)"*. View in prototype → **`/`** (trial over).
**Surface:** Persistent sidebar card after the trial ends; counts down the grace period. States: 30 / 7 / 1 days (urgent ≤ 7).

| Field | Current copy | Proposed |
|---|---|---|
| Header | Trial ended | |
| Subcopy | Everything stays saved. Teammates' shared meetings unlock when {org} is active. | |
| Urgent line (≤ 7 days) | `[alert]` {n} days until history is deleted | |
| Primary CTA | `[gem]` Upgrade | |
| Secondary CTA | Talk to sales | |

**Rules**
- Trigger: _Persistent after the trial ends, through the grace period._
- Dismissable? _No (persistent sidebar card)._
- Reappears? _Always present; adds the "history is deleted" alert at ≤ 7 days._

---

# 5 · Global copy questions

A few cross-hook consistency calls worth making once, so wording stays uniform:

1. **Trial footnote wording** — currently three variants:
   - `Grain Business · free for 14 days` (recording cut-off box)
   - `Included in Grain Business · free for 14 days` (feature gate, locked recording)
   - `Grain Business • Free for 14 days` (invite modal eyebrow — note `•` and capital "Free")
   → Pick one canonical form + punctuation.
2. **Start-trial CTA label** — currently `Start free trial`, `Start trial`, `Start free trial to unlock`, `Start trial to unlock`. → Standardize.
3. **"searchable, AI-ready memory"** phrase appears in the share collab block, teammate
   nudge, and invite grant line with slight variations. → Confirm one phrasing.
4. **"team" vs "organization"** — we use **team** in general UI and reserve
   **organization** for admin / settings / pricing / the org-creation flow. Flag anything
   that breaks this.

---

_Generated from the live components — "Current copy" reflects what's in the prototype
today. Several share/invite strings are still marked TODO in code and are the highest
priority for this pass._
