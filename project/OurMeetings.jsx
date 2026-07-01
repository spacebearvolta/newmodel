// OurMeetings.jsx — Workspace-level meeting defaults (admin view).
// Forked from MyMeetingsNew.jsx. Adds an "Allow member overrides" master toggle
// at the top of each settings card so admins can lock defaults across the workspace.

function OurMeetings({ showDiff }) {
  // ── State ─────────────────────────────────────────────────────────
  const [s, setS] = React.useState({
    // Master overrides — admin can disable per card
    allowCaptureOverrides: false,
    allowShareOverrides: false,
    // Preferred capture method (NEW): 'bot' | 'desktop' | 'customize'
    preferredMethod: 'bot',
    methodExternal: 'bot',
    methodInternal: 'desktop',
    methodUnscheduled: 'desktop',
    autoOrganizerOnly: false,
    fallback: true,
    // Sensitivity-tier share access
    accessNotSensitive: 'workspace',
    accessPossiblySensitive: 'teams',
    accessSensitive: 'participants',
    teamsNotSensitive: [],
    teamsPossiblySensitive: ['sales', 'cs', 'eng'],
    teamsSensitive: [],
    // Recap emails
    recap: 'all-participants',
    recapMethod: 'both',
    recapMeetingType: 'all',
    // General
    linkAccess: 'anyone',
  });
  const set = (k, v) => setS((p) => {
    const next = { ...p, [k]: v };
    // When customizing, if all three meeting-type methods collapse to a single
    // value ('bot' or 'desktop'), snap the top-level preferred method to it.
    if (
      next.preferredMethod === 'customize' &&
      ['methodExternal', 'methodInternal', 'methodUnscheduled'].includes(k)
    ) {
      const all = [next.methodExternal, next.methodInternal, next.methodUnscheduled];
      if (all.every((m) => m === 'bot')) next.preferredMethod = 'bot';
      else if (all.every((m) => m === 'desktop')) next.preferredMethod = 'desktop';
    }
    return next;
  });

  const accessOptions = [
    { value: 'workspace',    label: 'All workspace members' },
    { value: 'teams',        label: 'Selected teams & participants' },
    { value: 'participants', label: 'Only meeting participants' },
  ];

  const SENS_TIERS = [
    {
      key: 'NotSensitive',
      tag: 'Not sensitive',
      tagClass: 'low',
      desc: 'Meetings that do not contain any information that would be sensitive to a broad organization-wide audience.',
    },
    {
      key: 'PossiblySensitive',
      tag: 'Somewhat sensitive',
      tagClass: 'med',
      desc: 'Meetings that contain information that might be sensitive, depending on the information transparency in your organization.',
    },
    {
      key: 'Sensitive',
      tag: 'Sensitive',
      tagClass: 'high',
      desc: 'Meetings that contain information that is almost certainly sensitive to an audience outside the meeting.',
    },
  ];

  const recapOptions = [
    { value: 'all-participants', label: 'All participants' },
    { value: 'all-internal',     label: 'All internal participants' },
    { value: 'only-me',          label: 'Only me' },
    { value: 'none',             label: "Don't send" },
  ];

  const recapMethodOptions = [
    { value: 'bots',    label: 'Grain bots only' },
    { value: 'desktop', label: 'Desktop capture only' },
    { value: 'both',    label: 'Both' },
  ];

  const captureMethodOptions = [
    { value: 'bot',     label: 'Bot capture' },
    { value: 'desktop', label: 'Desktop capture' },
    { value: 'none',    label: "Don't capture" },
  ];

  const recapMeetingTypeOptions = [
    { value: 'internal', label: 'Internal only' },
    { value: 'external', label: 'External only' },
    { value: 'all',      label: 'All' },
  ];

  return (
    <div className="set-page">
      {/* ───────── Page header ───────── */}
      <header className="set-page__head">
        <h1 className="set-page__title">Our Meetings</h1>
        <p className="set-page__sub">Customize how workspace meetings get captured, shared, and summarized.</p>
      </header>

      {/* ───────── Section 1: Default capture settings ───────── */}
      <section className="set-section">
      <div className="set-sub__head">
        <div className="set-sub__titles">
          <h2 className="set-sub__title">Default capture settings</h2>
          <p className="set-sub__sub">These apply to every workspace member unless overridden. Turn off member overrides to make it so members cannot change these settings.</p>
        </div>
      </div>
      <div className="set-card">

        {/* Allow member overrides — master toggle */}
        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Allow member overrides</p>
              <p className="set-inline__desc">When on, members can change these capture defaults from their personal settings. Turn off to lock these settings workspace-wide.</p>
            </div>
            <ToggleSwitch checked={s.allowCaptureOverrides} onChange={(v) => set('allowCaptureOverrides', v)} />
          </div>
        </div>

        {/* Preferred capture method */}
        <div className="set-row set-row--divider">
          <div className="set-row__label">Preferred capture method</div>
          <div className="set-row__sub">How Grain captures workspace meetings by default.</div>
          <div className="radio-card-group" role="radiogroup" aria-label="Preferred capture method">
            <RadioCard
              icon="audio-lines"
              title="Desktop capture"
              description="The Grain desktop app will capture the meeting transcript (no video)."
              checked={s.preferredMethod === 'desktop'}
              onChange={() => set('preferredMethod', 'desktop')}
            />
            <RadioCard
              icon="video"
              title="Bot capture"
              description="The Grain notetaker bot will join calls and record the meeting."
              checked={s.preferredMethod === 'bot'}
              onChange={() => set('preferredMethod', 'bot')}
            />
            <RadioCard
              icon="sliders-horizontal"
              title="Customize"
              description="Select which capture method works best for which meeting type."
              checked={s.preferredMethod === 'customize'}
              onChange={() => set('preferredMethod', 'customize')}
            />
          </div>

          {s.preferredMethod === 'customize' && (
            <div className="capture-matrix" role="group" aria-label="Capture method per meeting type">
              <div className="capture-matrix__row">
                <div className="capture-matrix__text">
                  <p className="capture-matrix__title">External meetings</p>
                  <p className="capture-matrix__sub">Meetings with people outside your workspace.</p>
                </div>
                <Select
                  width={200}
                  value={s.methodExternal}
                  onChange={(v) => set('methodExternal', v)}
                  options={captureMethodOptions}
                />
              </div>
              <div className="capture-matrix__row">
                <div className="capture-matrix__text">
                  <p className="capture-matrix__title">Internal meetings</p>
                  <p className="capture-matrix__sub">Meetings with only your workspace members.</p>
                </div>
                <Select
                  width={200}
                  value={s.methodInternal}
                  onChange={(v) => set('methodInternal', v)}
                  options={captureMethodOptions}
                />
              </div>
              <div className="capture-matrix__row">
                <div className="capture-matrix__text">
                  <p className="capture-matrix__title">Unscheduled meetings</p>
                  <p className="capture-matrix__sub">Ad-hoc meetings not on the calendar.</p>
                </div>
                <Select
                  width={200}
                  value={s.methodUnscheduled}
                  onChange={(v) => set('methodUnscheduled', v)}
                  options={captureMethodOptions}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bot display settings — only relevant when Bot capture or Customize is selected */}
        {(s.preferredMethod === 'bot' || s.preferredMethod === 'customize') && (
          <div className="set-row set-row--continuation set-row--divider">
            <div className="set-inline">
              <div className="set-inline__text">
                <p className="set-inline__title">Bot display settings</p>
                <p className="set-inline__desc">Customize how the Grain Bot appears and behaves in meetings.</p>
              </div>
              <button type="button" className="set-customize">Edit</button>
            </div>
          </div>
        )}

        {/* Organizer-only — always shown */}
        <div className="set-row set-row--continuation">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Only auto-capture if the member is the event organizer</p>
              <p className="set-inline__desc">The Grain Bot will only auto-join meetings where the member is the organizer.</p>
            </div>
            <ToggleSwitch checked={s.autoOrganizerOnly} onChange={(v) => set('autoOrganizerOnly', v)} />
          </div>
        </div>

        {/* Fallback — always shown */}
        <div className="set-row set-row--continuation">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Record with bot when desktop capture fails</p>
              <p className="set-inline__desc">Automatically send the Grain bot to record when desktop capture can't start.</p>
            </div>
            <ToggleSwitch checked={s.fallback} onChange={(v) => set('fallback', v)} />
          </div>
        </div>

      </div>
      </section>

      {/* ───────── Section 2: Default share settings ───────── */}
      <section className="set-section">
      <div className="set-sub__head">
        <div className="set-sub__titles">
          <h2 className="set-sub__title">Default share settings</h2>
          <p className="set-sub__sub">Set who can access workspace meetings and how recap emails are sent.</p>
        </div>
      </div>
      <div className="set-card">

        {/* Allow member overrides — master toggle */}
        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Allow member overrides</p>
              <p className="set-inline__desc">When on, members can change these share defaults from their personal settings. Turn off to lock these settings workspace-wide.</p>
            </div>
            <ToggleSwitch checked={s.allowShareOverrides} onChange={(v) => set('allowShareOverrides', v)} />
          </div>
        </div>

        {SENS_TIERS.map((tier) => {
          const access = s[`access${tier.key}`];
          const teams = s[`teams${tier.key}`];
          return (
            <div className="set-row" key={tier.key}>
              <div className="set-inline">
                <div className="set-inline__text">
                  <div className="sens-row__head">
                    <span className={`sens-tag sens-tag--${tier.tagClass}`}>
                      <span className="sens-tag__dot" aria-hidden="true" />
                      {tier.tag}
                    </span>
                  </div>
                  <p className="set-inline__desc set-inline__desc--wide">{tier.desc}</p>
                </div>
                <Select
                  width={240}
                  value={access}
                  onChange={(v) => set(`access${tier.key}`, v)}
                  options={accessOptions}
                />
              </div>
              {access === 'teams' && (
                <TeamMultiSelect
                  selected={teams}
                  onChange={(next) => set(`teams${tier.key}`, next)}
                />
              )}
            </div>
          );
        })}

        {/* Meeting recap emails */}
        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Meeting recap emails</p>
              <p className="set-inline__desc">Who should receive recap emails after the meeting ends?</p>
            </div>
            <Select
              width={220}
              value={s.recap}
              onChange={(v) => set('recap', v)}
              options={recapOptions}
            />
          </div>
        </div>

        {s.recap !== 'none' && (
          <div className="set-row">
            <div className="set-inline">
              <div className="set-inline__text">
                <p className="set-inline__title">Send from capture method</p>
                <p className="set-inline__desc">Which capture types should Grain send recap emails for?</p>
              </div>
              <Select
                width={220}
                value={s.recapMethod}
                onChange={(v) => set('recapMethod', v)}
                options={recapMethodOptions}
              />
            </div>
          </div>
        )}

        {s.recap !== 'none' && (
          <div className="set-row">
            <div className="set-inline">
              <div className="set-inline__text">
                <p className="set-inline__title">Send from meeting types</p>
                <p className="set-inline__desc">Which meeting types should Grain send recap emails for?</p>
              </div>
              <Select
                width={220}
                value={s.recapMeetingType}
                onChange={(v) => set('recapMeetingType', v)}
                options={recapMeetingTypeOptions}
              />
            </div>
          </div>
        )}

        {/* Link access default */}
        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Link access default</p>
              <p className="set-inline__desc">Who can access workspace meeting recordings with a shared link?</p>
            </div>
            <Select
              width={220}
              value={s.linkAccess}
              onChange={(v) => set('linkAccess', v)}
              options={[
                { value: 'anyone', label: 'Anyone with link' },
                { value: 'workspace', label: 'Anyone in workspace' },
                { value: 'invited', label: 'Invited people only' },
              ]}
            />
          </div>
        </div>
      </div>
      </section>

      {/* ───────── Card 3: See member settings ───────── */}
      <MemberPreview />
    </div>
  );
}

Object.assign(window, { OurMeetings });
