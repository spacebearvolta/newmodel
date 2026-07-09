---
name: Grain Design System
description: SDL2-based. Use this as design system reference in every Claude/Stitch session.
---

# Grain Design System

## Philosophy
Always use semantic token names. Never raw hex or primitive names. The palette is large; the system is small. Distinguish elements with neutral steps, spacing, and weight first. Spend primary only on the single most-important CTA per screen.

## Fonts
- UI text: Inter
- Headings (H1–H4): Poppins

## Color Tokens

| Token | Role | Common uses |
|---|---|---|
| background | Page/app background | Page bg, app shell |
| foreground | Primary text | Headings, body, icons |
| card / card-foreground | Elevated panel surface + text | Cards, tables, panels |
| brand (#00B96C) | Logo & identity color (brand-500) | Grain logo, brand illustrations, chart-1 |
| primary (#009959) | Button & action color (brand-600) | CTA buttons, active nav, progress bar, links |
| primary-foreground | Text on primary bg | Button label on green |
| secondary / secondary-foreground | Lower-emphasis surfaces | Ghost buttons, tags, chips |
| muted / muted-foreground | Subdued bg + de-emphasized text | Helper text, timestamps, placeholders, captions |
| accent / accent-foreground | Hover highlights | Hover bg, selected row |
| destructive / destructive-foreground | Errors and delete only | Delete button, form error |
| border | Dividers and outlines | Card edges, table lines |
| input | Form field borders | Inputs, select, textarea |
| ring | Focus ring (accessibility) | All keyboard-focused elements |
| chart-1 → chart-5 | Data viz only | Charts — never UI chrome |
| sidebar, sidebar-primary, sidebar-accent | Nav sidebar surface + states | Left navigation panel |

Variable paths: base/primary · base/muted-foreground · base/destructive · base/border

## Typography
Single UI font: Inter. Headings: Poppins.

| Class | Size | Leading | Use |
|---|---|---|---|
| text-xs | 12px | 16px | Timestamps, metadata, fine-print |
| text-sm-alt | 13px | 20px | Secondary labels, list subtext |
| text-sm ★ | 14px | 20px | DEFAULT — most UI text |
| text-base | 16px | 24px | Body copy, input text |
| text-lg | 18px | 28px | Section titles (sparingly) |

Defaults: text-sm / medium for UI · text-sm / semibold for buttons and headers
Use leading-none for single-line labels · leading-normal for wrapping text.
Use Poppins (Typography/H1–H4 components) for all headings.

## Spacing (4px base)
Defaults: spacing/4 (16px) component padding · spacing/6 (24px) layout gaps

spacing/1=4px · /2=8px · /3=12px · /4=16px★ · /5=20px · /6=24px★ · /8=32px · /10=40px · /12=48px · /16=64px

## Border Radius
Default: rounded-md (8px) · rounded-full for avatars/pills

rounded-xs=2px · rounded-sm=6px · rounded-md=8px★ · rounded-lg=10px · rounded-xl=14px · rounded-2xl=16px · rounded-full=9999px

## Effects
One shadow level per context. Use border before shadow to create separation.

shadow/2xs → inline · shadow/xs → small cards · shadow/sm★ → default cards
shadow/md → dropdowns · shadow/lg → modals · shadow/xl → floating panels

focus/default on all interactive elements (keyboard accessibility, non-negotiable).

## Components
Avatar · Badge · Badge Number · Button · Checkbox · Radio Group · Switch · Separator · Kbd
Input · Input Group · Field · Textarea · Select
Table · Data Table · Chart · Calendar · Drawer
Typography: H1(Desktop+Mobile) H2 H3 H4 P Lead Large Small Muted Blockquote List InlineCode Code RichText

## Rules
## Button hierarchy
3 high-contrast solids + 1 low-contrast secondary + 1 outline tertiary. One primary CTA per page.

| Style | Token | When to use |
|---|---|---|
| Solid green | primary | Recording actions only: Record, View recording, Share clip, Add highlight |
| Solid black | foreground | All other primary CTAs: Save, Confirm, Submit, Create, Connect |
| Solid red | destructive | Irreversible actions only: Delete, Remove, Revoke — rare by design |
| Solid gray | secondary | Supporting actions alongside a primary: Cancel, Edit |
| Outline | border | Optional/tertiary: View details, Learn more |

Rule: green and black never appear together as co-equal primaries. Pick one per screen.

Destructive pairing rule: when a destructive (red) button is present, its paired escape action (Cancel) must always be the outline button — never the gray secondary. The outline recedes visually so the user reads the hierarchy correctly: red first, escape second.

## Rules
DO: semantic tokens always · default rounded-md/spacing-4/text-sm · green for recording CTAs · black for all other primary CTAs · one primary per page · muted-foreground for helper text · focus rings on every interactive element
DON'T: raw hex · gray-900 · primitive names · arbitrary spacing · green on non-recording buttons · destructive for warnings · chart tokens for UI

## Icons
All icons are from the Lucide set (SDL2 library, v0.383). Reference as `Icon / Name` in Figma, kebab-case in code.
Sizes: 12px dense · **16px ★ default** · 20px sidebar/headers · 24px prominent · 32px+ decorative only

### Verified Grain UI icons
**Global nav strip** (top→bottom): Search · Bell · Video *(Meetings — home page, NOT LayoutGrid)* · Layers *(Views)* · CirclePlay *(Templates)* · Megaphone *(Updates)*
**Meetings page header**: Video *(title icon)* · SlidersHorizontal *(filter)* · LayoutGrid *(view toggle)* · EllipsisVertical · Plus *(New, black CTA)* · AudioLines *(recording pill)*
**Recording page header**: ChevronRight *(breadcrumb)* · HubSpot logo *(CRM brand, not Lucide)* · Link2 *(Share)* · Asterisk *(AI actions)* · ChevronDown · EllipsisVertical
**Inline chips**: Calendar *(date)* · LockKeyhole *(team/workspace)*

For the full 1,468-icon catalog use the **Grain Icon Catalog skill** in Cowork (download from the Icons section of the design system guide).

---

## Account-model additions (Jul 2026 review — Alex/Jeff)

### Commercial buttons
- **Start-trial buttons are black** (`btn-v2--dark`) — black is our commercial color.
- If a screen already has a permanent black commercial button, render start-trial in **brand-secondary** so two blacks don't compete. *(Secondary spec pending Brad — until it lands, such screens are flagged, not guessed.)*
- **Upgrade / Reactivate stay green** (`btn-v2--primary`). Green remains brand-primary / product actions (Record, Share clip, etc.).

### Icons
- **Diamond (gem) = upgrade scenario only.** Never on start-trial.
- **Never use the up-arrow** as a generic accent — it reads as "upload."
- **Team/shared contexts use the team (two-people) icon, not the globe.**

### Icons in a box
- **Not boxed by default.** Only wrap an icon in a background box when it would otherwise free-float without structure (e.g. a lone glyph in a large empty header). Prefer a bare glyph inline with text. *(Tighter definition pending the boxed-icon audit.)*

### Copy
- **All subcopy: 2 lines max.** Every hook's supporting line (modal sub, banner body, card desc) wraps to at most 2 lines at its rendered width. If a message needs more, cut it — don't shrink type or widen the container. Lead with the consequence, then the value; drop restating what the title already says.
- **H2 (history-lock banner) subcopy: 2 lines max.**
- Lock messaging states the reason (meeting older than the 30-day free history window) and reinforces the value ("unlock your meeting history — forever").
- **45-min = recording/upload cap; 30-day = meeting-history lock. Never conflate them.** Hitting 45 min stops the recording but you keep the meeting (recording variant is a *cap*, not a block). Uploading a file over 45 min is genuinely blocked.

### Brand gradient
- Do **not** use the green→white gradient (reads as the default Claude Design gradient). Use `--grad-brand` (Alex's supplied subtle white→pale-mint). Swap the token when a final brand gradient asset lands.

### Invite / Share model (Jul 2026 — Alex/Jeff)
- **Never gate link-sharing behind payment.** Free view-only link-sharing is how Grain grows; we charge for workspace access + collaboration, not viewing.
- **Two access levels (Google-Docs style):**
  - **View (public link)** — see the meeting page; can't edit, comment, highlight, or collaborate. Free, ungated, shareable; recipients can sign up independently.
  - **Collaborate / workspace access** — edit, comment, highlight, and carry into future meetings. Requires a trial or upgrade.
- **Share button → free view-only link** (State A). Collaboration is offered as the paid unlock, handed off to the invite flow.
- **Invite button → invite-to-collaborate** (States B/D). Inviting grants workspace access + repository + future meetings → requires a trial (free) or upgrade (post-trial, State E). An ungated "view-only link" is always offered as the alternative (State C). External invitees behave the same for now.
- **Trial is provisioned before the invite.** You can't invite someone into a workspace that doesn't exist yet — "Start trial & invite" creates the workspace first, carrying the invitee forward into the org-creation invite step.
- **Removed:** the old unlimited free note-taker / "pro" seat invite — that's the broken status quo the new model replaces.
- Copy across these surfaces is **not finalized** (pending Jeff) — prototype uses `TODO-copy` placeholders reflecting direction only.
- Keep the **view-vs-collaborate split legible** everywhere — the surface most likely to confuse if the distinction isn't clean.

### Behavior
- **History-lock banner (H2)** is dismissible and **reappears every 14 days** (this pre/post-trial banner has its own cadence — separate from the in-trial, days-left-based dismissibility rules). *(Prototype notes the cadence; time-based reappearance isn't simulated.)*
- **Start-trial button icon = the team/people icon** (E1). Reserved off the two "unlock this old meeting" CTAs (H3/#12), where a team icon misreads.