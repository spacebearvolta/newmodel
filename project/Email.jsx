// Email.jsx — Email notifications subpage (reached from Preferences → Notification channels → Email)

function EmailNotifications() {
  const [s, setS] = React.useState({
    personalRecaps: true,
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

  // "Start trial" CTA used in place of a toggle for the upsell row
  const TrialRow = ({ title, desc, isFirst }) => (
    <div className={`set-row ${isFirst ? '' : 'set-row--continuation'}`}>
      <div className="set-inline">
        <div className="set-inline__text">
          <p className="set-inline__title">{title}</p>
          <p className="set-inline__desc">{desc}</p>
        </div>
        <button type="button" className="set-upsell__cta">Start trial</button>
      </div>
    </div>
  );

  return (
    <div className="set-page">
      {/* Page header — with breadcrumb back link */}
      <header className="set-page__head">
        <a className="set-page__breadcrumb" href="Preferences.html">
          <i data-lucide="chevron-left" />
          <span>Preferences</span>
        </a>
        <h1 className="set-page__title">Email</h1>
        <p className="set-page__sub">Configure your email updates.</p>
      </header>

      <section className="set-section">
        <div className="set-card">
          <ToggleRow
            isFirst
            title="Personal meeting recaps"
            desc="Get summaries and action items for all meetings you're in sent to your inbox."
            valueKey="personalRecaps"
          />
          <TrialRow
            title="Organization meeting recaps"
            desc="Get summaries and action items for all meetings you have access to in your organization sent to your inbox."
          />
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { EmailNotifications });
