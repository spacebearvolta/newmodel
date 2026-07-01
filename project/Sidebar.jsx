// Sidebar.jsx — Grain settings sidebar matching the screenshots
// Cross-page navigation for the prototype's two real screens.
// Other sidebar ids are unprototyped — they no-op to keep the demo focused.
const PROTOTYPE_ROUTES = {
  'my-meetings':  'My Meetings Settings Reorg.html',
  'our-meetings': 'Our Meetings Settings.html',
  'preferences':  'Preferences.html',
};

function Sidebar({ active = 'my-meetings', onNav }) {
  const groups = [
    {
      group: '',
      rows: [
        { id: 'my-meetings', label: 'My meetings', icon: 'video' },
        { id: 'preferences', label: 'Preferences', icon: 'sliders-horizontal' },
        { id: 'my-account', label: 'Profile', icon: 'user-round' },
        { id: 'connected-accounts', label: 'Connected accounts', icon: 'cpu' },
      ],
    },
  ];

  const Item = ({ r }) => (
    <a
      href={`#/${r.id}`}
      className={`gr-sidebar__item ${active === r.id ? 'is-active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        if (PROTOTYPE_ROUTES[r.id] && r.id !== active) {
          window.location.href = PROTOTYPE_ROUTES[r.id];
          return;
        }
        onNav && onNav(r.id);
      }}
    >
      {r.dotColor ? (
        <span
          className="gr-sidebar__avatar"
          style={{ background: r.dotColor }}
          aria-hidden="true"
        />
      ) : r.iconColor ? (
        <span style={{ color: r.iconColor, display: 'inline-flex' }} aria-hidden="true">
          <i data-lucide={r.icon} />
        </span>
      ) : (
        <i data-lucide={r.icon} />
      )}
      <span>{r.label}</span>
    </a>
  );

  return (
    <aside className="gr-sidebar">
      <div className="gr-sidebar__head">
        <a className="gr-sidebar__back" href="Meetings.html">
          <i data-lucide="chevron-left" /> Back to app
        </a>
      </div>
      <nav className="gr-sidebar__nav">
        {groups.map((g, gi) => (
          <div key={gi} className="gr-sidebar__group">
            {g.group && <div className="gr-sidebar__groupTitle">{g.group}</div>}
            {g.rows.map((r) => <Item key={r.id} r={r} />)}
          </div>
        ))}
      </nav>
    </aside>
  );
}

Object.assign(window, { Sidebar });
