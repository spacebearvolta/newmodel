import { Icon } from '../primitives/Icon';

export type SettingsPage = 'my-meetings' | 'preferences' | 'my-account' | 'connected-accounts';

const ROWS: { id: SettingsPage; label: string; icon: string }[] = [
  { id: 'my-meetings', label: 'My meetings', icon: 'video' },
  { id: 'preferences', label: 'Preferences', icon: 'slidersH' },
  { id: 'my-account', label: 'Profile', icon: 'user' },
  { id: 'connected-accounts', label: 'Connected accounts', icon: 'wrench' },
];

// Only "my-meetings" and "preferences" have real pages in this prototype —
// the others no-op, matching the original's PROTOTYPE_ROUTES comment.
const PROTOTYPED = new Set<SettingsPage>(['my-meetings', 'preferences']);

export function SettingsSidebar({ active, onNav, onBack }: { active: SettingsPage; onNav: (id: SettingsPage) => void; onBack?: () => void }) {
  return (
    <aside className="gr-sidebar">
      <div className="gr-sidebar__head">
        <a className="gr-sidebar__back" href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }}>
          <Icon name="chevLeft" size={14} /> Back to app
        </a>
      </div>
      <nav className="gr-sidebar__nav">
        <div className="gr-sidebar__group">
          {ROWS.map((r) => (
            <a
              key={r.id}
              href={`#/${r.id}`}
              className={`gr-sidebar__item ${active === r.id ? 'is-active' : ''}`}
              onClick={(e) => { e.preventDefault(); if (PROTOTYPED.has(r.id)) onNav(r.id); }}
            >
              <Icon name={r.icon} size={15} />
              <span>{r.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
}
