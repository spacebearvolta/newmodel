// Preferences.jsx — "App" preferences screen (desktop-app behavior + capture defaults)
// Recreated from the old Workspace → App settings page, surfaced under
// the "Preferences" entry in the reorganized sidebar.

function Preferences() {
  const [s, setS] = React.useState({
    openInDesktop:        true,
    openOnStartup:        true,
    openNotepad:          true,
    openAfterRecording:   true,
  });
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));

  const channels = [
    {
      id: 'desktop',
      icon: 'monitor',
      title: 'Desktop',
      enabled: true,
      status: 'Enabled for meeting reminder and detection notifications.',
      href: 'Desktop.html',
    },
    {
      id: 'email',
      icon: 'mail',
      title: 'Email',
      enabled: true,
      status: 'Enabled for personal meeting recaps.',
      href: 'Email.html',
    },
    {
      id: 'slack',
      icon: 'slack',
      title: 'Slack',
      enabled: false,
      status: 'Disabled',
    },
  ];

  // A single toggle row — used 6× at the top of the card
  const ToggleRow = ({ title, desc, valueKey, isFirst }) => (
    <div className={`set-row ${isFirst ? '' : 'set-row--continuation'}`}>
      <div className="set-inline">
        <div className="set-inline__text">
          <p className="set-inline__title">{title}</p>
          <p className="set-inline__desc">{desc}</p>
        </div>
        <ToggleSwitch checked={s[valueKey]} onChange={(v) => set(valueKey, v)} />
      </div>
    </div>
  );

  return (
    <div className="set-page">
      {/* Page header */}
      <header className="set-page__head">
        <h1 className="set-page__title">Preferences</h1>
        <p className="set-page__sub">Set how the Grain desktop app behaves on your computer.</p>
      </header>

      {/* ───────── App behavior ───────── */}
      <section className="set-section">
        <div className="set-sub__head">
          <div className="set-sub__titles">
            <h2 className="set-sub__title">App behavior</h2>
            <p className="set-sub__sub">Control how the Grain desktop app launches and notifies you.</p>
          </div>
        </div>
        <div className="set-card">
          <ToggleRow
            isFirst
            title="Open links in desktop app"
            desc="Always open Grain links in the desktop app instead of your browser."
            valueKey="openInDesktop"
          />
          <ToggleRow
            title="Open Grain app on system startup"
            desc="When you log in to your computer, Grain will automatically open."
            valueKey="openOnStartup"
          />
          <ToggleRow
            title="Open notepad when Grain starts recording"
            desc="Automatically open the notepad when Grain starts recording meetings."
            valueKey="openNotepad"
          />
          <ToggleRow
            title="Open to meeting after recording ends"
            desc="Open the Grain app after your meeting ends to easily review and share notes."
            valueKey="openAfterRecording"
          />
        </div>
      </section>

      {/* ───────── Notification channels ───────── */}
      <section className="set-section">
        <div className="set-sub__head">
          <div className="set-sub__titles">
            <h2 className="set-sub__title">Notification channels</h2>
            <p className="set-sub__sub">Choose how to be notified of meeting activity. Notifications will always go to your Grain updates in the sidebar.</p>
          </div>
        </div>
        <div className="set-card">
          {channels.map((c) => (
            <button
              key={c.id}
              type="button"
              className="set-channel"
              onClick={() => { if (c.href) window.location.href = c.href; }}
            >
              <span className="set-channel__icon" aria-hidden="true">
                <i data-lucide={c.icon} />
              </span>
              <span className="set-channel__text">
                <p className="set-channel__title">{c.title}</p>
                <p className="set-channel__status">
                  <span className={`set-channel__dot ${c.enabled ? 'set-channel__dot--on' : ''}`} />
                  {c.status}
                </p>
              </span>
              <i data-lucide="chevron-right" className="set-channel__chev" />
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}

Object.assign(window, { Preferences });
