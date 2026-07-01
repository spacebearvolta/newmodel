// Desktop.jsx — Desktop notifications subpage (reached from Preferences → Notification channels → Desktop)

function DesktopNotifications() {
  const [s, setS] = React.useState({
    meetingReminders: true,
    meetingDetection: true,
  });
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));

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
      {/* Page header — with breadcrumb back link */}
      <header className="set-page__head">
        <a
          className="set-page__breadcrumb"
          href="Preferences.html"
          onClick={(e) => {
            // Defensive: let normal navigation happen, but trap if a parent
            // app shell wants to intercept.
          }}
        >
          <i data-lucide="chevron-left" />
          <span>Preferences</span>
        </a>
        <h1 className="set-page__title">Desktop</h1>
        <p className="set-page__sub">Configure your desktop notifications.</p>
      </header>

      <section className="set-section">
        <div className="set-card">
          <ToggleRow
            isFirst
            title="Meeting reminder notifications"
            desc="Get notified 1m before your meetings start with a quick link to join."
            valueKey="meetingReminders"
          />
          <ToggleRow
            title="Meeting detection notifications"
            desc="Get notified to start capturing when you join a meeting that isn't set to auto-capture."
            valueKey="meetingDetection"
          />
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { DesktopNotifications });
