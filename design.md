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