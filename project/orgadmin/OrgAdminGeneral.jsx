// OrgAdminGeneral.jsx — Org admin → General settings page.
// Intentionally empty: this page is not changing in the reorg.

function OrgAdminGeneral() {
  return <OrgAdminStub title="General" icon="settings" />;
}

// Placeholder for the not-yet-built sidebar entries.
function OrgAdminStub({ title, icon }) {
  return (
    <div className="set-page">
      <header className="set-page__head">
        <p className="oa-eyebrow">Workspace</p>
        <h1 className="set-page__title">{title}</h1>
      </header>
      <div className="set-card oa-stub">
        <i data-lucide={icon || 'construction'} />
        <div>
          <p className="oa-stub__title">{title} settings live here.</p>
          <p className="oa-stub__sub">This section isn't built out in this prototype yet — the sidebar shows the full Organization admin nav.</p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OrgAdminGeneral, OrgAdminStub });
