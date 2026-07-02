// OrgAdminStub.tsx — placeholder page reused for every nav id that doesn't
// have a real built-out page (Members, Templates, Scorecards, Trackers,
// Billing, Plans, MCP Clients, API, and the third-party integrations).
import { Icon } from '../primitives/Icon';

export function OrgAdminStub({ title, icon }: { title: string; icon?: string }) {
  return (
    <div className="set-page">
      <header className="set-page__head">
        <p className="oa-eyebrow">Workspace</p>
        <h1 className="set-page__title">{title}</h1>
      </header>
      <div className="set-card oa-stub">
        <Icon name={icon || 'wrench'} size={28} />
        <div>
          <p className="oa-stub__title">{title} settings live here.</p>
          <p className="oa-stub__sub">This section isn't built out in this prototype yet — the sidebar shows the full Organization admin nav.</p>
        </div>
      </div>
    </div>
  );
}

export function OrgAdminGeneral() {
  return <OrgAdminStub title="General" icon="settings" />;
}
