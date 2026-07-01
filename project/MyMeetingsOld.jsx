// MyMeetingsOld.jsx — Snapshot of the EXISTING page, grouped by capture method.
// Used purely so reviewers can A/B against the new spec. Visually faithful to the screenshots.

function MyMeetingsOld() {
  const [s, setS] = React.useState({
    botAutoExternal: true,
    botAutoInternal: false,
    botAutoOrganizerOnly: false,
    botAutoOverridden: true,
    botShareExternal: false,
    botShareInternal: false,
    botRecap: 'none',
    botRecapOverridden: true,
    bypass: false,
    deskAutoExternal: false,
    deskAutoInternal: false,
    deskAutoUnscheduled: true,
    deskAutoOverridden: true,
    deskShareExternal: false,
    deskShareInternal: false,
    deskRecap: 'all-internal',
    linkAccess: 'anyone',
  });
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));

  return (
    <div className="set-page">
      <header style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 20,
          lineHeight: '28px',
          fontWeight: 600,
          color: 'var(--fg-1)',
          margin: '0 0 2px',
          letterSpacing: '-0.005em',
        }}>My Meetings</h1>
        <p style={{ fontSize: 13, lineHeight: '20px', color: 'var(--fg-2)', margin: 0 }}>
          Customize how your meetings get captured, shared, and summarized.
        </p>
      </header>

      {/* Bot capture settings — was first */}
      <div className="set-card">
        <div className="set-sub__head">
          <span className="set-sub__icon"><i data-lucide="video" /></span>
          <div className="set-sub__titles">
            <h3 className="set-sub__title">Bot capture settings</h3>
            <p className="set-sub__sub">Record, transcribe &amp; summarize meetings by having the Grain bot join.</p>
          </div>
        </div>

        <div className="set-row">
          <div className="set-row__label">Auto-capture with Grain Bot</div>
          <div className="set-row__sub">Which meeting types should the Grain bot automatically capture when the meeting starts?</div>
          <div className="set-row__controls">
            <Chip label="External meetings" checked={s.botAutoExternal} onChange={(v) => set('botAutoExternal', v)} />
            <Chip label="Internal meetings" checked={s.botAutoInternal} onChange={(v) => set('botAutoInternal', v)} />
          </div>
          <div style={{ marginTop: 12 }}>
            <SubOption label="Only auto-capture if I am the event organizer" checked={s.botAutoOrganizerOnly} onChange={(v) => set('botAutoOrganizerOnly', v)} />
          </div>
          <OverrideRow shown={s.botAutoOverridden} onReset={() => set('botAutoOverridden', false)} />
        </div>

        <div className="set-row">
          <div className="set-row__label">Team auto-share</div>
          <div className="set-row__sub">Which meeting types should Grain automatically share with your team?</div>
          <div className="set-row__controls">
            <Chip label="External meetings" checked={s.botShareExternal} onChange={(v) => set('botShareExternal', v)} />
            <Chip label="Internal meetings" checked={s.botShareInternal} onChange={(v) => set('botShareInternal', v)} />
          </div>
        </div>

        <div className="set-row">
          <div className="set-row__label">Meeting recap emails</div>
          <div className="set-row__sub">Who should receive recap emails after the meeting ends?</div>
          <Select
            width={280}
            value={s.botRecap}
            onChange={(v) => set('botRecap', v)}
            options={[
              { value: 'none', label: "Don't send recap emails" },
              { value: 'all-internal', label: 'Send recap to all internal participants' },
              { value: 'organizer', label: 'Send recap to event organizer only' },
              { value: 'all', label: 'Send recap to all participants' },
            ]}
          />
          <OverrideRow shown={s.botRecapOverridden} onReset={() => set('botRecapOverridden', false)} />
        </div>

        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Bot display settings</p>
              <p className="set-inline__desc">Customize how the Grain Bot appears and behaves in meetings.</p>
            </div>
            <button type="button" className="set-customize">Customize</button>
          </div>
        </div>

        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Bypass waiting room for Google Meet&nbsp;&nbsp;📹</p>
              <p className="set-inline__desc">When enabled, the Grain Bot will be added as an attendee to calendar events you organize that match your auto-record rules. It will automatically join those meetings without waiting to be admitted.</p>
            </div>
            <ToggleSwitch checked={s.bypass} onChange={(v) => set('bypass', v)} />
          </div>
        </div>
      </div>

      {/* Desktop capture settings — was second */}
      <div className="set-card">
        <div className="set-sub__head">
          <span className="set-sub__icon"><i data-lucide="audio-lines" /></span>
          <div className="set-sub__titles">
            <h3 className="set-sub__title">Desktop capture settings</h3>
            <p className="set-sub__sub">Transcribe &amp; summarize meetings with the desktop app, no bot needed.</p>
          </div>
        </div>

        <div className="set-row">
          <div className="set-row__label">Auto-capture</div>
          <div className="set-row__sub">Which meeting types should Grain automatically capture when you join?</div>
          <div className="set-row__controls">
            <Chip label="External meetings" checked={s.deskAutoExternal} onChange={(v) => set('deskAutoExternal', v)} />
            <Chip label="Internal meetings" checked={s.deskAutoInternal} onChange={(v) => set('deskAutoInternal', v)} />
            <Chip label="Unscheduled meetings" checked={s.deskAutoUnscheduled} onChange={(v) => set('deskAutoUnscheduled', v)} />
          </div>
          <OverrideRow shown={s.deskAutoOverridden} onReset={() => set('deskAutoOverridden', false)} />
        </div>

        <div className="set-row">
          <div className="set-row__label">Team auto-share</div>
          <div className="set-row__sub">Which meeting types should Grain automatically share with your team?</div>
          <div className="set-row__controls">
            <Chip label="External meetings" checked={s.deskShareExternal} onChange={(v) => set('deskShareExternal', v)} />
            <Chip label="Internal meetings" checked={s.deskShareInternal} onChange={(v) => set('deskShareInternal', v)} />
          </div>
        </div>

        <div className="set-row">
          <div className="set-row__label">Meeting recap emails</div>
          <div className="set-row__sub">Who should receive recap emails after the meeting ends?</div>
          <Select
            width={280}
            value={s.deskRecap}
            onChange={(v) => set('deskRecap', v)}
            options={[
              { value: 'none', label: "Don't send recap emails" },
              { value: 'all-internal', label: 'Send recap to all internal participants' },
              { value: 'organizer', label: 'Send recap to event organizer only' },
              { value: 'all', label: 'Send recap to all participants' },
            ]}
          />
        </div>
      </div>

      {/* General settings */}
      <div className="set-card">
        <div className="set-sub__head">
          <span className="set-sub__icon"><i data-lucide="settings" /></span>
          <div className="set-sub__titles">
            <h3 className="set-sub__title">General settings</h3>
            <p className="set-sub__sub">These settings apply to all meetings captured by Grain.</p>
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">Link access default</div>
          <div className="set-row__sub">Who can access your meeting recordings with a shared link?</div>
          <Select
            width={280}
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
  );
}

Object.assign(window, { MyMeetingsOld });
