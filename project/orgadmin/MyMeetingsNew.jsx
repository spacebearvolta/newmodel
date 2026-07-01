// MyMeetingsNew.jsx — Reorganized settings page (Capture vs Share)
// One icon per top-level section card. Sub-groupings inside use plain text headers
// stacked with dividers, matching the original "Bot capture settings" card pattern.

// Access controls for one capture type (participants + nonparticipants tiers).
// Rendered inside a capture-type card's bordered body; keyed by `keyPrefix`
// ('bot' | 'desk') so each capture type holds its own values.
function AccessFields({ keyPrefix, s, set }) {
  const partKey = keyPrefix + 'ParticipantAccess';
  const sensKey = keyPrefix + 'AccessNotSensitive';
  return (
    <>
      {/* Default access for participants */}
      <div className="oa-access-field">
        <div className="set-inline">
          <div className="set-inline__text">
            <p className="set-inline__title">Default access for participants</p>
            <p className="set-inline__desc">Choose which meeting participants automatically get access to meetings you record.</p>
          </div>
          <Select
            width={220}
            value={s[partKey]}
            onChange={(v) => set(partKey, v)}
            options={[
            { value: 'all-participants', label: 'All meeting participants' },
            { value: 'acme-only', label: 'Only acme.com participants' },
            { value: 'org-only', label: 'Only organization participants' }]
            } />
        </div>
      </div>

      {/* Default access for nonparticipants */}
      <div className="oa-access-field">
        <p className="set-inline__title">Default access for nonparticipants</p>
        <p className="set-inline__desc" style={{ marginTop: 2 }}>Choose which workspace members get access to meetings they did not attend.</p>

        <div className="oa-access-tier">
          <div className="oa-sens-row">
            <div className="oa-sens-main">
              <span className="sens-tag sens-tag--low">
                <span className="sens-tag__dot" aria-hidden="true" />
                Not sensitive
              </span>
              <p className="set-inline__desc set-inline__desc--wide oa-sens-desc">Meetings that do not contain any information that would be sensitive to a broad organization-wide audience.</p>
            </div>
            <Select
              width={220}
              value={s[sensKey]}
              onChange={(v) => set(sensKey, v)}
              options={[
              { value: 'workspace', label: 'All workspace members' },
              { value: 'participants', label: 'Only meeting participants' }]
              } />
          </div>
        </div>

        <div className="oa-access-tier">
          <span className="sens-tag sens-tag--high">
            <span className="sens-tag__dot" aria-hidden="true" />
            Sensitive
          </span>
          <p className="set-inline__desc set-inline__desc--wide oa-sens-desc" style={{ marginTop: 12 }}><strong style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Only participants</strong> — Sensitive meetings are not automatically shared with nonparticipants.</p>
        </div>
      </div>
    </>);

}

// Capture-method card: the radio cards + bot display + organizer + fallback
// rows. Identical across My Meetings, Org admin → Meetings, and Team defaults,
// so it lives here and is reused everywhere to stay in lockstep.
function CaptureMethodCard({ s, set }) {
  const captureMethodOptions = [
  { value: 'bot', label: 'Bot capture' },
  { value: 'desktop', label: 'Desktop capture' },
  { value: 'none', label: "Don't capture" }];

  return (
    <div className="set-card">

      {/* Preferred capture method */}
      <div className="set-row set-row--divider">
        <div className="set-row__label">Capture method</div>
        <div className="set-row__sub">How you'd like Grain to capture all your meetings.</div>
        <div className="radio-card-group" role="radiogroup" aria-label="Capture method">
          <RadioCard
            icon="audio-lines"
            title="Desktop capture"
            description="The Grain desktop app will capture the meeting transcript (no video)."
            checked={s.preferredMethod === 'desktop'}
            onChange={() => set('preferredMethod', 'desktop')} />
            
          <RadioCard
            icon="video"
            title="Bot capture"
            description="The Grain notetaker bot will join your calls and record the meeting."
            checked={s.preferredMethod === 'bot'}
            onChange={() => set('preferredMethod', 'bot')} />
            
          <RadioCard
            icon="sliders-horizontal"
            title="Customize"
            description="Select which capture method works best for which meeting type."
            checked={s.preferredMethod === 'customize'}
            onChange={() => set('preferredMethod', 'customize')} />
            
        </div>

        {s.preferredMethod === 'customize' &&
        <div className="capture-matrix" role="group" aria-label="Capture method per meeting type">
            <div className="capture-matrix__row">
              <div className="capture-matrix__text">
                <p className="capture-matrix__title">External meetings</p>
                <p className="capture-matrix__sub">Meetings with people outside your organization.</p>
              </div>
              <Select
              width={220}
              value={s.methodExternal}
              onChange={(v) => set('methodExternal', v)}
              options={captureMethodOptions} />
              
            </div>
            <div className="capture-matrix__row">
              <div className="capture-matrix__text">
                <p className="capture-matrix__title">Internal meetings</p>
                <p className="capture-matrix__sub">Meetings with only your organization members.</p>
              </div>
              <Select
              width={220}
              value={s.methodInternal}
              onChange={(v) => set('methodInternal', v)}
              options={captureMethodOptions} />
              
            </div>
            <div className="capture-matrix__row">
              <div className="capture-matrix__text">
                <p className="capture-matrix__title">Unscheduled meetings</p>
                <p className="capture-matrix__sub">Ad-hoc meetings not on your calendar.</p>
              </div>
              <Select
              width={220}
              value={s.methodUnscheduled}
              onChange={(v) => set('methodUnscheduled', v)}
              options={captureMethodOptions} />
              
            </div>
          </div>
        }
      </div>

      {/* Bot display settings — shown for Bot, Desktop, or Customize capture */}
      {(s.preferredMethod === 'bot' || s.preferredMethod === 'desktop' || s.preferredMethod === 'customize') &&
      <div className="set-row set-row--continuation set-row--divider">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Bot display settings</p>
              <p className="set-inline__desc" data-comment-anchor="61f9977fc2-p-224-17">Customize how the Grain Bot appears and behaves in meetings.</p>
            </div>
            <button type="button" className="set-customize">Edit</button>
          </div>
        </div>
      }

      {/* Organizer-only — always shown */}
      <div className="set-row set-row--continuation">
        <div className="set-inline">
          <div className="set-inline__text">
            <p className="set-inline__title">Only auto capture if an organization member is the event organizer</p>
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

    </div>);

}

function MyMeetingsNew({ showDiff, showArtboard = true, orgAdmin = false, embed = false, scope }) {
  // `scope` controls org-vs-team wording. The org Meetings page and a team's
  // "Team default settings" render this exact same component (embed mode drops
  // the page header so it nests inside the team page).
  const scopeWord = scope === 'team' ? 'team' : 'organization';
  // ── State ─────────────────────────────────────────────────────────
  const [s, setS] = React.useState({
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
    autoOrganizerOnly: false,
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
    recapMethod: 'both', // 'bots' | 'desktop' | 'both'
    recapMeetingType: 'all', // 'internal' | 'external' | 'all'
    recapOverridden: true,
    // Bypass
    bypass: false,
    // Default access (Access settings)
    participantAccess: 'all-participants',
    // Recording access — shared-first modes with per-capture-type customize.
    // participantMode: 'all-participants' | 'acme-only' | 'org-only' | 'customize'
    participantMode: 'all-participants',
    participantBot: 'all-participants',
    participantDesk: 'all-participants',
    // nonAttendMode: 'all-org' | 'participants' | 'customize'
    nonAttendMode: 'all-org',
    nonAttendBot: 'all-org',
    nonAttendDesk: 'all-org',
    // Per-capture-type access (org admin: Bot vs Desktop capture cards)
    botParticipantAccess: 'all-participants',
    botAccessNotSensitive: 'workspace',
    deskParticipantAccess: 'all-participants',
    deskAccessNotSensitive: 'workspace',
    // Org admin master toggles — only used when orgAdmin=true
    allowCaptureOverrides: false,
    allowShareOverrides: false,
    // General
    linkAccess: 'anyone',
    recapEmails: true
  });
  const set = (k, v) => setS((p) => {
    const next = { ...p, [k]: v };
    // When customizing, if all three meeting-type methods collapse to a single
    // value ('bot' or 'desktop'), snap the top-level preferred method to it.
    if (
    next.preferredMethod === 'customize' &&
    ['methodExternal', 'methodInternal', 'methodUnscheduled'].includes(k))
    {
      const all = [next.methodExternal, next.methodInternal, next.methodUnscheduled];
      if (all.every((m) => m === 'bot')) next.preferredMethod = 'bot';else
      if (all.every((m) => m === 'desktop')) next.preferredMethod = 'desktop';
    }
    return next;
  });

  // ── Meeting sensitivity instructions modal ───────────────────────
  // Persisted instructions used by Grain's meeting sensitivity detection
  // agent. This does NOT change the access policy directly.
  const [sensInstructions, setSensInstructions] = React.useState(
    'Mark meetings as sensitive if they include legal, HR, compensation, or performance topics.'
  );
  const [sensModalOpen, setSensModalOpen] = React.useState(false);
  const [sensDraft, setSensDraft] = React.useState(sensInstructions);

  const openSensModal = () => {
    setSensDraft(sensInstructions); // prefill with current saved value
    setSensModalOpen(true);
  };
  const cancelSensModal = () => setSensModalOpen(false); // discard changes
  const saveSensModal = () => {
    setSensInstructions(sensDraft); // persist textarea value
    setSensModalOpen(false);
  };

  const accessOptions = [
  { value: 'workspace', label: 'All workspace members' },
  { value: 'teams', label: 'Selected teams & participants' },
  { value: 'participants', label: 'Only meeting participants' }];

  // Recording access — per-capture-type dropdown options (no "customize" entry).
  const participantAccessOptions = [
  { value: 'all-participants', label: 'All meeting participants' },
  { value: 'acme-only', label: 'Only acme.com participants' },
  { value: 'org-only', label: 'Only organization participants' }];

  const nonAttendAccessOptions = [
  { value: 'all-org', label: scopeWord === 'team' ? 'All team members' : 'All organization members' },
  { value: 'participants', label: 'Only meeting participants' }];

  // Section-level dropdowns add a "Customize by capture type" entry that reveals
  // the per-capture fields below.
  const participantModeOptions = [
  ...participantAccessOptions,
  { value: 'customize', label: 'Customize by capture type' }];

  const nonAttendModeOptions = [
  ...nonAttendAccessOptions,
  { value: 'customize', label: 'Customize by capture type' }];

  // Only one mode is active per section. Selecting Customize seeds both the
  // bot and desktop dropdowns from the previously selected shared value.
  const pickParticipantMode = (mode) => {
    if (mode === 'customize') {
      const prev = ['all-participants', 'acme-only', 'org-only'].includes(s.participantMode) ? s.participantMode : 'all-participants';
      setS((p) => ({ ...p, participantMode: 'customize', participantBot: prev, participantDesk: prev }));
    } else {
      set('participantMode', mode);
    }
  };
  const pickNonAttendMode = (mode) => {
    if (mode === 'customize') {
      const prev = ['all-org', 'participants'].includes(s.nonAttendMode) ? s.nonAttendMode : 'all-org';
      setS((p) => ({ ...p, nonAttendMode: 'customize', nonAttendBot: prev, nonAttendDesk: prev }));
    } else {
      set('nonAttendMode', mode);
    }
  };


  const SENS_TIERS = [
  {
    key: 'NotSensitive',
    tag: 'Not sensitive',
    tagClass: 'low',
    desc: 'Meetings that do not contain any information that would be sensitive to a broad organization-wide audience.'
  },
  {
    key: 'PossiblySensitive',
    tag: 'Somewhat sensitive',
    tagClass: 'med',
    desc: 'Meetings that contain information that might be sensitive, depending on the information transparency in your organization.'
  },
  {
    key: 'Sensitive',
    tag: 'Sensitive',
    tagClass: 'high',
    desc: 'Meetings that contain information that is almost certainly sensitive to an audience outside the meeting.'
  }];


  const recapOptions = [
  { value: 'all-participants', label: 'All participants' },
  { value: 'all-internal', label: 'All internal participants' },
  { value: 'only-me', label: 'Only me' },
  { value: 'none', label: "Don't send" }];


  const recapMethodOptions = [
  { value: 'bots', label: 'Grain bots only' },
  { value: 'desktop', label: 'Desktop capture only' },
  { value: 'both', label: 'Both' }];


  const captureMethodOptions = [
  { value: 'bot', label: 'Bot capture' },
  { value: 'desktop', label: 'Desktop capture' },
  { value: 'none', label: "Don't capture" }];


  const recapMeetingTypeOptions = [
  { value: 'internal', label: 'Internal only' },
  { value: 'external', label: 'External only' },
  { value: 'all', label: 'All' }];


  const Root = embed ? React.Fragment : 'div';
  const rootProps = embed ? {} : { className: 'set-page' };

  return (
    <Root {...rootProps}>
      {/* ───────── Page header ───────── */}
      {!embed &&
      <header className="set-page__head">
        <h1 className="set-page__title">{orgAdmin ? 'Meetings' : 'My Meetings'}</h1>
        <p className="set-page__sub">{orgAdmin ?
          'Set meeting capture and access defaults for your organization.' :
          'Customize how your meetings get captured, shared, and summarized.'}</p>
      </header>
      }

      {/* ───────── Section 1: Capture settings ───────── */}
      <section className="set-section">
      <div className="set-sub__head">
        <div className="set-sub__titles">
          <h2 className="set-sub__title">{orgAdmin ? 'Default capture settings' : 'Capture settings'}</h2>
          <p className="set-sub__sub">{orgAdmin ?
              `These apply to every ${scopeWord} member unless overridden. Turn off member overrides to make it so members cannot change these settings.` :
              "Set how you'd like Grain to capture your meetings."}</p>
        </div>
      </div>

      {orgAdmin &&
        <div className="set-card oa-cap-card oa-cap-card--toggle oa-cap-card--override">
          <div className="set-sub__head">
            <span className="set-sub__icon"><i data-lucide="refresh-cw" /></span>
            <div className="set-sub__titles">
              <h2 className="set-sub__title">Allow member overrides</h2>
              <p className="set-sub__sub">{`When on, members can change these capture defaults from their personal settings. Turn off to lock these settings ${scopeWord}-wide.`}</p>
            </div>
            <ToggleSwitch checked={s.allowCaptureOverrides} onChange={(v) => set('allowCaptureOverrides', v)} />
          </div>
        </div>
        }

      <CaptureMethodCard s={s} set={set} />
      </section>

      {/* ───────── Section 2: Access settings ───────── */}
      <section className="set-section">
      <div className="set-sub__head">
        <div className="set-sub__titles">
          <h2 className="set-sub__title" data-comment-anchor="07fd5fa8cf-h2-260-11">{orgAdmin ? 'Default access settings' : 'Access settings'}</h2>
          <p className="set-sub__sub">{orgAdmin ?
              `Set who can access recordings and shared links by default across your ${scopeWord}.` :
              'Control who can access your meeting captures.'}</p>
        </div>
      </div>

      {orgAdmin &&
        <div className="set-card oa-cap-card oa-cap-card--toggle oa-cap-card--override">
          <div className="set-sub__head">
            <span className="set-sub__icon"><i data-lucide="refresh-cw" /></span>
            <div className="set-sub__titles">
              <h2 className="set-sub__title">Allow member overrides</h2>
              <p className="set-sub__sub">{`When on, ${scopeWord} members can change these access defaults in their personal settings. Turn off to require everyone to use the ${scopeWord} defaults.`}</p>
            </div>
            <ToggleSwitch checked={s.allowShareOverrides} onChange={(v) => set('allowShareOverrides', v)} />
          </div>
        </div>
        }
      {orgAdmin ?
        <>
          {/* Recording access — one shared-first card for bot + desktop capture */}
          <div className="set-card oa-rec-card">
            <div className="set-sub__head oa-rec-head" data-comment-anchor="cf1dc98949-div-443-13">
              <div className="set-sub__titles">
                <h3 className="set-sub__title">Meeting access</h3>
                <p className="set-sub__sub">Control who can access recordings created by bot capture or desktop capture.</p>
              </div>
            </div>

            {/* Section: Sensitivity instructions */}
            <div className="oa-rec-section">
              <div className="set-inline">
                <div className="set-inline__text">
                  <p className="oa-rec-section__label">Sensitivity instructions</p>
                  <p className="set-inline__desc set-inline__desc--wide oa-sens-desc" style={{ marginTop: 6 }} data-comment-anchor="5e9b1d6dee-p-501-19">Tell Grain what types of meetings should be marked sensitive. Sensitive meetings are not automatically shared with people who did not attend. <strong style={{ color: 'var(--fg-1)', fontWeight: 600 }}>Sensitive meetings are never shared.</strong></p>
                </div>
                <button type="button" className="set-customize" onClick={openSensModal}>Edit instructions</button>
              </div>
            </div>

            {/* Section 2: Access for people who did not attend */}
            <div className="oa-rec-section">
              <div className="set-inline">
                <div className="set-inline__text">
                  <p className="oa-rec-section__label">Access for nonparticipants</p>
                  <p className="oa-rec-section__sub">{`For non-sensitive meetings, choose whether ${scopeWord} members who did not attend can access the recording. Applies to bot and desktop capture unless customized.`}</p>
                </div>
                <Select width={240} value={s.nonAttendMode} onChange={pickNonAttendMode} options={nonAttendModeOptions} />
              </div>
              {s.nonAttendMode === 'customize' &&
              <div className="capture-matrix" role="group" aria-label="Nonparticipant access per capture type">
                  <div className="capture-matrix__row">
                    <div className="capture-matrix__text oa-cap-row__text"><span className="set-sub__icon oa-cap-row__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg></span><p className="capture-matrix__title">Bot capture</p></div>
                    <Select width={240} value={s.nonAttendBot} onChange={(v) => set('nonAttendBot', v)} options={nonAttendAccessOptions} />
                  </div>
                  <div className="capture-matrix__row">
                    <div className="capture-matrix__text oa-cap-row__text"><span className="set-sub__icon oa-cap-row__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" /></svg></span><p className="capture-matrix__title">Desktop capture</p></div>
                    <Select width={240} value={s.nonAttendDesk} onChange={(v) => set('nonAttendDesk', v)} options={nonAttendAccessOptions} />
                  </div>
                </div>
              }
            </div>

            {/* Section: Access for meeting participants */}
            <div className="oa-rec-section">
              <div className="set-inline">
                <div className="set-inline__text">
                  <p className="oa-rec-section__label">Access for meeting participants</p>
                  <p className="oa-rec-section__sub">Choose which meeting participants automatically get access to recordings. Applies to bot and desktop capture unless customized.</p>
                </div>
                <Select width={240} value={s.participantMode} onChange={pickParticipantMode} options={participantModeOptions} />
              </div>
              {s.participantMode === 'customize' &&
              <div className="capture-matrix" role="group" aria-label="Participant access per capture type">
                  <div className="capture-matrix__row">
                    <div className="capture-matrix__text oa-cap-row__text"><span className="set-sub__icon oa-cap-row__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg></span><p className="capture-matrix__title">Bot capture</p></div>
                    <Select width={240} value={s.participantBot} onChange={(v) => set('participantBot', v)} options={participantAccessOptions} />
                  </div>
                  <div className="capture-matrix__row">
                    <div className="capture-matrix__text oa-cap-row__text"><span className="set-sub__icon oa-cap-row__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" /></svg></span><p className="capture-matrix__title">Desktop capture</p></div>
                    <Select width={240} value={s.participantDesk} onChange={(v) => set('participantDesk', v)} options={participantAccessOptions} />
                  </div>
                </div>
              }
            </div>

          </div>
        </> :

        <div className="set-card">

        {/* Default access for participants */}
        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Default access for participants</p>
              <p className="set-inline__desc">Choose which meeting participants automatically get access to meetings you record.</p>
            </div>
            <Select
                width={220}
                value={s.participantAccess}
                onChange={(v) => set('participantAccess', v)}
                options={[
                { value: 'all-participants', label: 'All meeting participants' },
                { value: 'acme-only', label: 'Only acme.com participants' },
                { value: 'org-only', label: 'Only organization participants' }]
                } />
              
          </div>
        </div>

        {/* Default access for nonparticipants — section header */}
        <div className="set-row">
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
              <p className="set-inline__desc set-inline__desc--wide oa-sens-desc">Meetings that do not contain any information that would be sensitive to a broad organization-wide audience.</p>
            </div>
            <Select
                width={220}
                value={s.accessNotSensitive}
                onChange={(v) => set('accessNotSensitive', v)}
                options={[
                { value: 'workspace', label: 'All workspace members' },
                { value: 'participants', label: 'Only meeting participants' }]
                } />
          </div>
        </div>

        {/* Sensitive — fixed, no dropdown */}
        <div className="set-row">
          <div className="oa-sens-row">
            <span className="sens-tag sens-tag--high">
              <span className="sens-tag__dot" aria-hidden="true" />
              Sensitive
            </span>
          </div>
          <p className="set-inline__desc set-inline__desc--wide oa-sens-desc"><strong style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Only participants</strong> — Sensitive meetings are not automatically shared with nonparticipants.</p>
        </div>
      </div>
        }
      </section>

      {/* ───────── Section 3: Link access default (own section) ───────── */}
      <section className="set-section">
      <div className="set-card">
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
                { value: 'workspace', label: 'Anyone in organization' },
                { value: 'invited', label: 'Invited people only' }]
                } />
              
          </div>
        </div>
      </div>
      </section>

      {/* ───────── Fallback notification artboard ───────── */}
      {showArtboard && <FallbackNotificationArtboard />}

      {/* ───────── Meeting sensitivity instructions modal ───────── */}
      {sensModalOpen &&
      <div className="sens-modal__overlay" onMouseDown={cancelSensModal}>
          <div
          className="sens-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sens-modal-title"
          onMouseDown={(e) => e.stopPropagation()}>
            <div className="sens-modal__head">
              <div className="sens-modal__titles">
                <h2 className="sens-modal__title" id="sens-modal-title">Meeting Sensitivity Instructions</h2>
                <p className="sens-modal__desc">Tell Grain what types of meetings should be marked sensitive. Sensitive meetings are not automatically shared with people who did not attend.</p>
              </div>
              <button type="button" className="mm-close" aria-label="Close" onClick={cancelSensModal}>
                <i data-lucide="x" />
              </button>
            </div>

            <div className="sens-modal__body">
              <label className="sens-modal__label" htmlFor="sens-modal-field">Instructions</label>
              <textarea
              id="sens-modal-field"
              className="sens-modal__textarea"
              value={sensDraft}
              onChange={(e) => setSensDraft(e.target.value)}
              placeholder="Example: Mark meetings as sensitive if they include legal, HR, compensation, performance, security, fundraising, or confidential customer information."
              rows={6} />
            </div>

            <div className="sens-modal__foot">
              <button type="button" className="set-customize" onClick={cancelSensModal}>Cancel</button>
              <button type="button" className="sens-modal__save" onClick={saveSensModal}>Save</button>
            </div>
          </div>
        </div>
      }
    </Root>);

}

Object.assign(window, { MyMeetingsNew, CaptureMethodCard, AccessFields });