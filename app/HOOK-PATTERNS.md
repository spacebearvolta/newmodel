# Grain prototype — hook patterns & handoff

This is the working prototype of the Grain app rebuilt as a real React + Vite +
TypeScript app. It exists to demo the **trial/upsell "hooks"** (the moments where
a free/trial user is nudged toward Grain Business) inside a faithful reproduction
of the real product surfaces.

**For all visual rules** (color, type, spacing, radius, shadow, button hierarchy,
icon sizes) see **`../design.md`** at the repo root. This doc deliberately does not
restate them — it covers structure and mechanics only.

---

## Run it

```
cd app
npm install
npm run dev        # http://localhost:5173
```

Node is pinned to 24.13.0 via `.tool-versions`. If you use asdf and hit
"No version is set for nodejs", run `asdf install nodejs 24.13.0 && asdf set nodejs 24.13.0`
once in this folder.

`npm run build` runs `tsc -b && vite build` — use it as the correctness gate before
committing.

## Routes (`src/App.tsx`)

| Path | What |
|---|---|
| `/` | The real app (Meetings home). Persona/trial state driven by the Tweaks panel. |
| `/onboarding` | First-run signup flow |
| `/settings` | Personal settings (My Meetings, Preferences, Desktop/Email subpages) |
| `/integrations` | Integrations settings (hosts the live CRM connection gate, H6) |
| `/org-admin` | Organization admin |
| `/hook-gallery` | **Dev tool**: every hook shown one at a time with state switches |
| `/trial-emails` | Static email mockups (H7 grace, H9 teammate) |

Every top-level surface has a floating **Tweaks panel** (`components/tweaks/TweaksPanel.tsx`,
bottom-right, open by default) to switch persona (creator/joiner), trial day counts,
trial-over state, org existence, etc. This is how you reach each hook state without real data.

---

## The hook system (read this before adding touchpoints)

**All hook components live in one file: `src/components/hooksV2/HooksV2Live.tsx`.**
Each is exported once and reused in *both* places it needs to appear:

1. the **live app** surface that triggers it, and
2. the **Hook Gallery** (`src/data/hooks.tsx`), the review tool.

There is exactly one visual definition of each hook. **Do not** create a
separate "gallery" or "mockup" copy — an earlier version of this repo had a
parallel set of old components that drifted out of sync and shipped stale
designs to the gallery. That whole shadow set has been deleted. One component,
two consumers.

### Current hooks (11)

| Tag | Component (in HooksV2Live.tsx) | Lives in the live app at |
|---|---|---|
| H1 | `RecordingLimitModalV2Live` | Creator flow (`CreatorApp.tsx`) — record/upload > 45 min |
| H2 | `HistoryLockBannerV2Live` | Meetings list, free user near 30-day limit |
| H3 | `LockedMeetingModalV2Live` | Creator flow — opening a >30-day-old meeting |
| H4/H5 | `TeamValueModalV2Live` | Creator flow — Invite / Share attempt |
| H6 | `HgGateCardV2Live` | `IntegrationsApp.tsx` — free user opens a CRM integration |
| H7 | `TrialExpiredInterstitialV2Live` | Creator flow — first login after trial ends |
| H7 | `TrialEndedCardV2Live` | Sidebar card during the grace period |
| H8 | `FeatureNudgeChipV2Live` | `MeetingsSurface.tsx` — using a Business feature on trial |
| H9 | `TeammateNudgeV2Live` | Creator flow — teammate's first meeting captured |
| Trial | `TrialWidgetV2Live` | Sidebar card during active trial |
| Trial | `TrialCountdownV2Live` | Popup opened from the trial widget |

### Building blocks

Hooks are composed from a small v2 kit (defined in `src/redesign/redesign.css`,
values per design.md): `btn-v2` (+ `--primary` / `--dark` / `--ghost` / `--warn`
/ `--full` / `--lg`), `card-v2`, `modal-v2`, `mark-v2` (icon badge), `eyebrow-v2`.
Icons come from `components/primitives/Icon.tsx` (hand-coded Lucide SVGs, camelCase
names). Modals use `components/primitives/Modal.tsx` with `bare` for hooks that
bring their own card.

---

## How to add a new touchpoint

1. **Build the component** in `HooksV2Live.tsx` as an exported function using the
   v2 kit above. Take real `open`/`onClose`/`on*` callback props so it can wire
   into a live surface (don't hardcode dismissal).
2. **Add it to the Hook Gallery** — a new entry in `HG_HOOKS` in `src/data/hooks.tsx`
   (tag, title, trigger description, `kind: 'modal' | 'inline'`, optional `states`,
   and a `render` fn). This makes it reviewable at `/hook-gallery` immediately.
3. **Wire it into the live surface** that should trigger it (the relevant
   `*App.tsx` / `MeetingsSurface.tsx`), gated on the right Tweaks/trial state.
4. **Verify**: `npm run build` for types, then drive it in the browser at
   `/hook-gallery` and in the live surface (use the Tweaks panel to reach the state).
   Confirm against design.md, not just "looks fine."

---

## Syncing to GitHub

This sandbox can't push directly. The workflow is: commit locally here → generate
`git bundle create <file> --all` → the file is sent to the user → they pull it into
their local clone and push. If GitHub has commits the sandbox doesn't (e.g. files
added via the GitHub web UI), the user's push needs a
`git pull origin main --no-edit --no-rebase` first. Keep the sandbox in sync after
each round with `git fetch origin main && git merge --ff-only origin/main`.
