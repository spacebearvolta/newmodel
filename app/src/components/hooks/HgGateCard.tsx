import { Icon } from '../primitives/Icon';

// H6 · CRM connection gate. The real surface lives on the Integrations page
// (out of scope here); this mirrors it for the gallery.
export function HgGateCard() {
  return (
    <div className="hg-gate">
      <div className="hg-gate__eyebrow">
        <Icon name="sparkles" size={13} /> Grain Business · free for 14 days
      </div>
      <div className="hg-gate__logo">H</div>
      <h2 className="hg-gate__title">Try Grain Business to connect HubSpot</h2>
      <p className="hg-gate__desc">
        Skip the manual data entry, auto-sync AI notes to HubSpot Contact and Meeting objects.
      </p>
      <button className="btn btn--dark btn--pill btn--lg">
        <span className="btn-label">Start free trial</span>
      </button>
    </div>
  );
}
