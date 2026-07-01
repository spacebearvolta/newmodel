# Sidebar label update

_Started 2026-05-19 18:53 UTC_

---

## User

Update "Teams" label in the sidebar to "Share groups"

## Assistant

_[tool: grep]_

_[tool: list_files]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: done]_

Updated the sidebar label from "Teams" to "Share groups".

## User

Can you reorder Bot capture and desktop capture squares so Desktop capture is first.

## Assistant

_[tool: snip]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: done]_

Swapped — Desktop capture is now the first option, with Bot capture second.

## User

Do the same for the "My meetings" tab

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: done]_

Done — Desktop capture is now first in the My Meetings tab as well.

## User

Only show the "Bot display settings" when the "Bot capture" is selected.

## Assistant

_[tool: snip]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Done — Bot display settings now only show when Bot capture is selected (applied to both My Meetings and Our Meetings tabs). Note: when "Customize" is selected, Bot display is hidden too even though bot could be used per meeting type — let me know if you'd like it to show there as well.

## User

Do this for My Meetings & Our Meetings

## Assistant

_[tool: snip]_

Already done — the Bot display settings conditional was applied to both the My Meetings and Our Meetings tabs in my previous change. Anything else you'd like to adjust?

## User

These settings should always show, regardless of the selections:
1. Record with bot when desktop capture fails
2. Only auto-capture if the member is the event organizer

Bot display settings should only show when "Bot capture" and "Customize" is selected.

Apply to both My Meetings and Our Meetings.

## Assistant

_[tool: snip]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Done across both tabs:
- "Record with bot when desktop capture fails" and "Only auto-capture if the member is the event organizer" now always show.
- "Bot display settings" shows only when Bot capture or Customize is selected.

## User

Add a divider line under the capture method selection squares.

## Assistant

_[tool: snip]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Added a divider line under the capture method squares in both tabs.

## User

The vertical distribution is off.

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Tightened the spacing under the divider so the toggle rows sit closer to it. I've sent a verifier to check the spacing balance — it'll report back.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

Spacing looks good per the verifier — anything else to adjust?

## User

You have duplicate under customize: "Only auto-capture if I am the event organizer"

## Assistant

_[tool: snip]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: done]_

Removed the duplicate organizer toggle from inside the Customize matrix on My Meetings. The always-shown one below the divider is now the single source.

## User

Add "All internal participants" option

## Assistant

_[tool: snip]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Added "All internal participants" between "Only me" and "All participants" in all three recap dropdowns (My Meetings, Our Meetings, and the member modal).

## User

Order as...

- All participants
- All internal participants
- Only me
- Don't send

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Reordered across all three places.

## User

In the sidebar, remove the "share groups" section and just add an item above templates that says, "Teams"

## Assistant

_[tool: snip]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: done]_

Removed the Share groups section and added a "Teams" item above Templates in Administration.

## User

Bot display settings should be above "Only auto-capture if I am the event organizer" since those are present, regardless of selection.

## Assistant

_[tool: snip]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Bot display settings now appears above the organizer toggle in both tabs.

## User

there should be a divider line between "bot display settings" and "only auto-capture if ..." setting.

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Added a divider line under Bot display settings, separating it from the organizer toggle.

## User

If someone under "Customize" selects bot capture for everything or "desktop capture" for everything, it should automatically toggle to the "Desktop capture" or "Bot capture" selection.

## Assistant

_[tool: snip]_

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Done — in both tabs, if all three Customize selectors are set to Bot (or all to Desktop), the top-level radio snaps to that selection automatically.

## User

Can you change "customize" button for Bot display settings to "Edit"

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Changed.

## User

OK, please update the sidebar to have the following items...

Profile
My meetings
Connected accounts (use similar icon as screenshot)
App

Remove averything else from the sidebar.

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

Sidebar trimmed to just Profile, My meetings, Connected accounts, and App.

## User

make the background outside of the containers gray to match the existing designs.

## Assistant

_[tool: snip]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: done]_

Background outside the cards is now gray (`--bg-1`), so the white cards stand out as in the reference.

## User

I want to pull the section headers outside the containers, like Linear does in this screenshot.

## Assistant

_[tool: snip]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

I'll restructure so the section header (icon + title + description) sits above each card instead of inside it. Updating both tabs and the member modal.

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Pulled the section headers (icon + title + description) outside the card containers. Verifier is checking now.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

Headers are now outside the cards. The verifier flagged that the gray background in `settings.css` is being overridden somewhere — want me to track that down, or leave it?

## User

OK, now remove those icons for the headers. Linear does not have headers.

Also, the background space in the settings is still not gray like the screenshot.

Lastly, remove the "reviewing" thing at the top. I don't want it.

## Assistant

_[tool: snip]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Done — icons removed from section headers, background is now gray, and the Reviewing strap is gone.

## User

Why does the hierarchy on the Page title vs. section title look better in Linear?

Can you fix that?

## Assistant

_[tool: snip]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Why it looked weaker: page title was only 20px (just slightly larger than the 15px section title) — so the eye didn't get a clear "this is the page, this is a section under it" jump. I bumped the page title to 28px / tighter letter-spacing and dropped section titles to 14px to widen the gap, matching Linear's hierarchy.

## User

1. Rename "Share settings" header to "Access settings" header
2. Update content in "Access settings" container:
- Remove the sensitive settings.
- Remove the recap email settings
3. Above Link access default, add a section like the "Upgrade to customize AI notes with templates. Get the key information in the format you want on every call." in the screenshot that says, "Start a trial to automatically give your org access to meeting context for AI agents." — "Start trial" should be a blue button like "Upgrade" is in the screenshot.

## Assistant

_[tool: snip]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Done — Access settings now contains just the upsell strip ("Start trial" blue button + copy) and the Link access default row. The sensitivity tiers and recap email settings are gone from this section.

## User

Center the start trial line in the vertical space between the top of the container and the divider line.

The divider line should be in the vertical center of the section container.

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

Equalized — upsell and link access row each have 14px top + bottom padding, with the divider as the shared boundary, so it sits at the vertical center.

## User

In the sidebar: Add "Preferences" to the sidebar — use screenshot icon.

Remove "App"

Order:
My meetings
Preferences
Profile
Connected

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

Sidebar updated — App removed, Preferences added with the sliders icon, and ordered as you specified.

## User

Now add one more section container in under "Access settings"

Name: Meeting Updates

Set how you'd like to receive updates after your meetings.

In the container:

Recap emails
Get AI meeting summaries and action items sent to your inbox 
^ This setting as an on / off togglet

Slack updates
Get AI meeting summaries and action items sent to Slack

^ this setting has a "Connect" button like the screenshot shows.

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

Added a "Meeting updates" section under Access settings with the Recap emails toggle and the Slack updates row with a "Connect ↗" link.

