// MyMeetingsNew.jsx — Reorganized settings page (Capture vs Share)
// One icon per top-level section card. Sub-groupings inside use plain text headers
// stacked with dividers, matching the original "Bot capture settings" card pattern.

function MyMeetingsNew({ showDiff, onTrial = false, simpleShare = true }) {
  // ── State ─────────────────────────────────────────────────────────
  const [s, setS] = React.useState({
    // Per-capture-method access defaults (mirror Org admin → Meetings)
    desktopParticipantAccess: 'none',
    desktopNonSensAccess: 'workspace',
    botParticipantAccess: 'all-participants',
    botNonSensAccess: 'workspace',
    // Preferred capture method (NEW): 'bot' | 'desktop' | 'customize'
    preferredMethod: 'bot',
    // Per-meeting-type method overrides (only used when preferredMethod === 'customize')
    methodExternal: 'bot',
    methodInternal: 'desktop',
    methodUnscheduled: 'desktop',
    // Auto-capture (unified across methods)
    autoExternal: true,
    autoInternal: false,
    autoUnscheduled: true,
    autoOrganizerOnly: true,
    autoOverridden: true,
    // Fallback (unified — falls back to the other method)
    fallback: true,
    fallbackOverridden: false,
    // Sensitivity-tier share access. Values: 'workspace' | 'teams' | 'participants'
    accessNotSensitive: 'workspace',
    accessPossiblySensitive: 'teams',
    accessSensitive: 'participants',
    teamsNotSensitive: [],
    teamsPossiblySensitive: ['sales', 'cs', 'eng'],
    teamsSensitive: [],
    // Recap emails (controls who receives an email after the meeting)
    recap: 'all-participants',
    recapMethod: 'both',           // 'bots' | 'desktop' | 'both'
    recapMeetingType: 'all',       // 'internal' | 'external' | 'all'
    recapOverridden: true,
    // Bypass
    bypass: false,
    // General
    linkAccess: 'anyone',
    recapEmails: true,
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
        <h1 className="set-page__title">My Meetings</h1>
        <p className="set-page__sub">Customize how your meetings get captured, shared, and summarized.</p>
      </header>

      {/* ───────── Section 1: Capture settings ───────── */}
      <section className="set-section">
      <div className="set-sub__head">
        <div className="set-sub__titles">
          <h2 className="set-sub__title">Capture settings</h2>
          <p className="set-sub__sub">Set how you'd like Grain to capture your meetings.</p>
        </div>
      </div>
      <div className="set-card">

        {/* Preferred capture method */}
        <div className="set-row set-row--divider">
          <div className="set-row__label">Preferred capture method</div>
          <div className="set-row__sub">How you'd like Grain to capture all your meetings.</div>
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
              description="The Grain notetaker bot will join your calls and record the meeting."
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
                  <p className="capture-matrix__sub">Ad-hoc meetings not on your calendar.</p>
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

        {/* Bot display settings — shown for every capture method */}
        <div className="set-row set-row--continuation set-row--divider">
            <div className="set-inline">
              <div className="set-inline__text">
                <p className="set-inline__title">Bot display settings</p>
                <p className="set-inline__desc">Customize how the Grain Bot appears and behaves in meetings.</p>
              </div>
              <button type="button" className="set-customize">Edit</button>
            </div>
          </div>

        {/* Organizer-only — always shown */}
        <div className="set-row set-row--continuation">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Only auto-capture if I am the event organizer</p>
              <p className="set-inline__desc">When on, the Grain Bot will only auto-join meetings where you're the organizer.</p>
            </div>
            <ToggleSwitch checked={s.autoOrganizerOnly} onChange={(v) => set('autoOrganizerOnly', v)} />
          </div>
        </div>

        {/* Fallback — always shown */}
        <div className="set-row set-row--continuation">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Use fallback capture</p>
              <p className="set-inline__desc">If your preferred capture method fails, automatically try the other one.</p>
            </div>
            <ToggleSwitch checked={s.fallback} onChange={(v) => set('fallback', v)} />
          </div>
        </div>

      </div>
      </section>

      {/* ───────── Section 2: Access settings ───────── */}
      <section className="set-section">
      <div className="set-sub__head">
        <div className="set-sub__titles">
          <h2 className="set-sub__title">Access settings</h2>
          <p className="set-sub__sub">Control who can access your meeting captures.</p>
        </div>
      </div>

      {/* Capture access — "Simple share settings" collapses the two per-method
         (Bot / Desktop) access cards into a single plain statement. Toggle the
         tweak off for the full per-capture-type controls. */}
      {simpleShare ? (
        <div className="set-card">
          <div className="set-statement">
            <span className="set-statement__icon"><i data-lucide="users"></i></span>
            <p className="set-statement__text">
              Participants have access to your <strong>bot captured</strong> meetings. Desktop captured meetings are only shared <strong>manually</strong>.
            </p>
          </div>
          {!onTrial && (
            <div className="set-upsell set-upsell--bordered">
              <div className="set-upsell__copy">
                <p className="set-upsell__title">Non-participant sharing</p>
                <p className="set-upsell__text">Automatically give teammates access to meetings they didn’t attend.</p>
              </div>
              <button type="button" className="set-upsell__cta" onClick={() => { window.location.href = 'Meetings.html'; }}>Start trial</button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Desktop capture access */}
          <CaptureAccessSection
            title="Desktop capture access"
            sub="Who gets access to meetings captured by the Grain desktop app."
            onTrial={onTrial}
            participantValue={s.desktopParticipantAccess}
            onParticipant={(v) => set('desktopParticipantAccess', v)}
            nonSensValue={s.desktopNonSensAccess}
            onNonSens={(v) => set('desktopNonSensAccess', v)}
            onStartTrial={() => { window.location.href = 'Meetings.html'; }}
          />

          {/* Bot capture access */}
          <CaptureAccessSection
            title="Bot capture access"
            sub="Who gets access to meetings captured by the Grain notetaker bot."
            onTrial={onTrial}
            participantValue={s.botParticipantAccess}
            onParticipant={(v) => set('botParticipantAccess', v)}
            nonSensValue={s.botNonSensAccess}
            onNonSens={(v) => set('botNonSensAccess', v)}
            onStartTrial={() => { window.location.href = 'Meetings.html'; }}
          />
        </>
      )}

      {/* Link access default — moved from General settings */}
      <div className="set-card" style={{ marginTop: 24 }}>
        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Link access default</p>
              <p className="set-inline__desc">Who can access your meeting recordings with a shared link?</p>
            </div>
            <Select
              width={220}
              value={s.linkAccess}
              onChange={(v) => set('linkAccess', v)}
              options={[
                { value: 'anyone', label: 'Anyone with link' },
                onTrial
                  ? { value: 'workspace', label: 'Anyone in Acme' }
                  : {
                      value: 'workspace',
                      label: 'Anyone in Acme',
                      disabled: true,
                      accessory: <button type="button" className="set-mini-cta" onClick={() => { window.location.href = 'Meetings.html'; }}>Start trial</button>,
                    },
                { value: 'invited', label: 'People with access' },
              ]}
            />
          </div>
        </div>
      </div>
      </section>

      {/* ───────── Fallback notification artboard ───────── */}
      <FallbackNotificationArtboard />
    </div>
  );
}

/* ── Capture-access section (one per capture method) ───────────────────
   Mirrors Org admin → Meetings access config: a "Default access for
   participants" dropdown plus a "Default access for nonparticipants" block
   with sensitivity tiers. Nonparticipant org-wide sharing is a Business
   feature — when the user isn't in an organization on a trial, that block
   shows a Start trial button instead of the controls. */
function CaptureAccessSection({ title, sub, onTrial, participantValue, onParticipant, nonSensValue, onNonSens, onStartTrial }) {
  const participantOptions = [
    { value: 'all-participants', label: 'All meeting participants' },
    { value: 'acme-only',        label: 'Only Acme participants' },
    onTrial
      ? { value: 'org-only', label: 'Only organization participants' }
      : {
          value: 'org-only',
          label: 'Only organization participants',
          disabled: true,
          accessory: <button type="button" className="set-mini-cta" onClick={onStartTrial}>Start trial</button>,
        },
    { value: 'none', label: 'None' },
  ];
  const nonSensOptions = [
    { value: 'workspace',    label: 'All workspace members' },
    { value: 'participants', label: 'None' },
  ];
  return (
    <div className="set-card">
      <div className="set-row set-row--divider">
        <div className="set-row__label">{title}</div>
        <div className="set-row__sub">{sub}</div>
      </div>

      {/* Default access for participants */}
      <div className="set-row set-row--continuation">
        <div className="set-inline">
          <div className="set-inline__text">
            <p className="set-inline__title">Default access for participants</p>
            <p className="set-inline__desc">Choose which meeting participants automatically get access to meetings you record.</p>
          </div>
          <Select width={240} value={participantValue} onChange={onParticipant} options={participantOptions} />
        </div>
      </div>

      {onTrial ? (
        <>
          {/* Default access for nonparticipants — header */}
          <div className="set-row set-row--continuation">
            <p className="set-inline__title">Default access for nonparticipants</p>
            <p className="set-inline__desc" style={{ marginTop: 2 }}>Choose which workspace members get access to meetings they did not attend.</p>
          </div>

          {/* Not sensitive — has a dropdown */}
          <div className="set-row set-row--continuation">
            <div className="oa-sens-row">
              <div className="oa-sens-main">
                <span className="sens-tag sens-tag--low">
                  <span className="sens-tag__dot" aria-hidden="true" />
                  Not sensitive
                </span>
                <p className="set-inline__desc oa-sens-desc">Meetings that do not contain any information that would be sensitive to a broad organization-wide audience.</p>
              </div>
              <Select width={240} value={nonSensValue} onChange={onNonSens} options={nonSensOptions} />
            </div>
          </div>

          {/* Sensitive — fixed, no dropdown */}
          <div className="set-row set-row--continuation">
            <div className="oa-sens-row">
              <span className="sens-tag sens-tag--high">
                <span className="sens-tag__dot" aria-hidden="true" />
                Sensitive
              </span>
            </div>
            <p className="set-inline__desc oa-sens-desc"><strong style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Only participants</strong> — Sensitive meetings are not automatically shared with nonparticipants.</p>
          </div>
        </>
      ) : (
        /* Not in an organization on a trial — Start trial sits right-justified with the dropdowns */
        <div className="set-row set-row--continuation">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Default access for nonparticipants</p>
              <p className="set-inline__desc">Choose which workspace members get access to meetings they did not attend.</p>
            </div>
            <button type="button" className="set-upsell__cta" onClick={onStartTrial}>Start trial</button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { MyMeetingsNew });
