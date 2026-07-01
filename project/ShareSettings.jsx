// ShareSettings.jsx — sensitivity-tiered share access controls.

const TEAMS = [
  { id: 'sales',     name: 'Sales',           members: ['MR', 'JC', 'OR', 'AB', 'NK', 'SP', 'TM', 'LK'], yours: true },
  { id: 'cs',        name: 'Customer Success', members: ['SM', 'ML', 'LI', 'KH', 'JD', 'RW'] },
  { id: 'eng',       name: 'Engineering',     members: ['VP', 'KY', 'RM', 'AC', 'DH', 'FT', 'GN', 'HW', 'IO', 'JZ', 'PQ', 'XU'] },
  { id: 'product',   name: 'Product',         members: ['PS', 'HC', 'TB', 'NL', 'BF'], yours: true },
  { id: 'marketing', name: 'Marketing',       members: ['JH', 'RT', 'DP', 'CL'] },
  { id: 'leadership',name: 'Leadership',      members: ['WC', 'AV', 'MD', 'EB'] },
];

// Stable pastel palette keyed by initials so the same avatar always gets the same color.
const AVATAR_PALETTE = [
  '#A7E6D7', '#FBE2A8', '#F2C2D5', '#C6D8F5', '#E3D0F5',
  '#FFD1B3', '#B7E1C9', '#F7C9C9', '#D2E3A8', '#C8E5F0',
  '#F0CDE8', '#D8D5F5',
];
function avatarColor(initials) {
  let h = 0;
  for (let i = 0; i < initials.length; i++) h = (h * 31 + initials.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

function TeamAvatarStack({ members, max = 3 }) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  return (
    <span className="team-stack">
      <span className="team-stack__avatars">
        {shown.map((m, i) => (
          <span
            key={i}
            className="team-stack__av"
            style={{ background: avatarColor(m), zIndex: shown.length - i }}
          >
            {m}
          </span>
        ))}
      </span>
      {extra > 0 && <span className="team-stack__more">+{extra} more</span>}
    </span>
  );
}

function TeamMultiSelect({ selected, onChange }) {
  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    onChange(next);
  };
  return (
    <div className="team-picker">
      <div className="team-picker__head">
        <span className="team-picker__title">Choose teams to share with</span>
        <span className="team-picker__count">{selected.length} of {TEAMS.length} teams</span>
      </div>
      <ul className="team-picker__list">
        {TEAMS.map((t) => {
          const on = selected.includes(t.id);
          return (
            <li key={t.id} className={`team-row ${on ? 'is-on' : ''}`}>
              <label className="team-row__main">
                <span
                  className="team-row__box"
                  role="checkbox"
                  aria-checked={on}
                  tabIndex={0}
                  onClick={(e) => { e.preventDefault(); toggle(t.id); }}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(t.id); }
                  }}
                >
                  {on && (
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <a
                  className="team-row__name"
                  href={`#/teams/${t.id}`}
                  onClick={(e) => e.stopPropagation()}
                >{t.name}</a>
                {t.yours && <span className="team-row__yours">Member</span>}
              </label>
              <div className="team-row__right">
                <TeamAvatarStack members={t.members} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

Object.assign(window, { TeamMultiSelect, TEAMS });
