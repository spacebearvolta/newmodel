// MemberPreview.jsx — "See member settings" section. Searchable member dropdown
// + View button that opens (eventually) a per-member settings modal.

const MEMBERS = [
  { id: 'wc', name: 'Will Chen',       email: 'will@grain.co',     teams: ['Leadership', 'Sales'] },
  { id: 'jw', name: 'Jeff Whitlock',   email: 'jeff@grain.co',     teams: ['Leadership'], me: true },
  { id: 'mr', name: 'Maria Rodriguez', email: 'maria@grain.co',    teams: ['Sales'] },
  { id: 'sm', name: 'Sam Morales',     email: 'sam@grain.co',      teams: ['Customer Success'] },
  { id: 'kh', name: 'Kira Han',        email: 'kira@grain.co',     teams: ['Customer Success', 'Sales'] },
  { id: 'vp', name: 'Vikram Patel',    email: 'vikram@grain.co',   teams: ['Engineering'] },
  { id: 'ky', name: 'Kayla Young',     email: 'kayla@grain.co',    teams: ['Engineering'] },
  { id: 'ps', name: 'Priya Shah',      email: 'priya@grain.co',    teams: ['Product'] },
  { id: 'hc', name: 'Henry Cho',       email: 'henry@grain.co',    teams: ['Product'] },
  { id: 'jh', name: 'Jordan Hayes',    email: 'jordan@grain.co',   teams: ['Marketing'] },
  { id: 'rt', name: 'Riya Thompson',   email: 'riya@grain.co',     teams: ['Marketing'] },
  { id: 'av', name: 'Alex Vargas',     email: 'alex@grain.co',     teams: ['Leadership'] },
  { id: 'md', name: 'Mei Davis',       email: 'mei@grain.co',      teams: ['Leadership', 'Product'] },
  { id: 'eb', name: 'Eli Barrett',     email: 'eli@grain.co',      teams: ['Leadership'] },
  { id: 'or', name: 'Olivia Reyes',    email: 'olivia@grain.co',   teams: ['Sales'] },
];

function initialsOf(name) {
  return name.split(/\s+/).map((p) => p[0] || '').join('').slice(0, 2).toUpperCase();
}

function memberAvatarColor(id) {
  // Reuse the avatar palette pattern from ShareSettings for visual consistency.
  const palette = ['#A7E6D7', '#FBE2A8', '#F2C2D5', '#C6D8F5', '#E3D0F5', '#FFD1B3', '#B7E1C9', '#F7C9C9', '#D2E3A8', '#C8E5F0', '#F0CDE8', '#D8D5F5'];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function MemberSearchableSelect({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const ref = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  React.useEffect(() => {
    if (open) {
      setQ('');
      // Focus search on next tick after dropdown mounts
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  }, [open]);

  const selected = MEMBERS.find((m) => m.id === value) || MEMBERS[0];
  const filtered = q.trim()
    ? MEMBERS.filter((m) => {
        const needle = q.toLowerCase();
        return m.name.toLowerCase().includes(needle) || m.email.toLowerCase().includes(needle);
      })
    : MEMBERS;

  return (
    <div ref={ref} className="member-picker">
      <button
        type="button"
        className="member-picker__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span
          className="member-picker__av"
          style={{ background: memberAvatarColor(selected.id) }}
          aria-hidden="true"
        >
          {initialsOf(selected.name)}
        </span>
        <span className="member-picker__text">
          <span className="member-picker__name">
            {selected.name}
            {selected.me && <span className="member-picker__me"> (me)</span>}
          </span>
          <span className="member-picker__sep" aria-hidden="true">·</span>
          <span className="member-picker__sub">{selected.teams.join(' · ')}</span>
        </span>
        <svg
          className="member-picker__caret"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="member-picker__menu" role="listbox">
          <div className="member-picker__search">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search members"
            />
          </div>
          <ul className="member-picker__list">
            {filtered.length === 0 && (
              <li className="member-picker__empty">No members match "{q}"</li>
            )}
            {filtered.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={`member-picker__opt ${m.id === value ? 'is-on' : ''}`}
                  onClick={() => { onChange(m.id); setOpen(false); }}
                >
                  <span
                    className="member-picker__av member-picker__av--sm"
                    style={{ background: memberAvatarColor(m.id) }}
                    aria-hidden="true"
                  >
                    {initialsOf(m.name)}
                  </span>
                  <span className="member-picker__opt-text">
                    <span className="member-picker__opt-name">
                      {m.name}
                      {m.me && <span className="member-picker__me"> (me)</span>}
                    </span>
                    <span className="member-picker__opt-sub">{m.email}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MemberPreview() {
  const [selected, setSelected] = React.useState('wc');

  const onView = () => {
    // Hook up to member-settings modal in next iteration.
    window.dispatchEvent(new CustomEvent('grain:view-member', { detail: { memberId: selected } }));
  };

  return (
    <div className="set-card">
      <div className="set-sub__head">
        <span className="set-sub__icon"><i data-lucide="user-search" /></span>
        <div className="set-sub__titles">
          <h2 className="set-sub__title">See member settings</h2>
          <p className="set-sub__sub">Review and set member settings.</p>
        </div>
      </div>

      <div className="set-row">
        <div className="member-preview">
          <MemberSearchableSelect value={selected} onChange={setSelected} />
          <button type="button" className="member-preview__view" onClick={onView}>
            View
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MemberPreview, MEMBERS });
