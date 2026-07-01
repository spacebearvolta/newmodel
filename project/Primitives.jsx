// Primitives.jsx — checkbox chips, dropdowns, toggles, override line, etc.

function CheckIcon({ size = 10 }) {
  // Inline SVG (not a Lucide <i> replacement) so React keeps full DOM ownership
  // when this node is conditionally mounted/unmounted on toggle.
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Chip({ label, checked, onChange }) {
  return (
    <button
      type="button"
      className={`chip ${checked ? 'is-on' : ''}`}
      aria-pressed={!!checked}
      onClick={() => onChange && onChange(!checked)}
    >
      <span className="chip__box" aria-hidden="true">
        <span className="chip__check"><CheckIcon size={10} /></span>
      </span>
      <span>{label}</span>
    </button>
  );
}

function SubOption({ label, checked, onChange, isNew }) {
  return (
    <label
      className={`set-suboption ${checked ? 'is-on' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        onChange && onChange(!checked);
      }}
    >
      <span className="set-suboption__box" aria-hidden="true">
        <span className="set-suboption__check"><CheckIcon size={10} /></span>
      </span>
      <span>{label}</span>
    </label>
  );
}

function OverrideRow({ shown, onReset }) {
  if (!shown) return null;
  return (
    <div className="set-override">
      <span>You've overridden your team's default setting.</span>
      <button type="button" className="set-override__reset" onClick={onReset}>Reset</button>
    </div>
  );
}

function Select({ value, options, onChange, width }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const label = options.find((o) => o.value === value)?.label || value;
  return (
    <div ref={ref} style={{ position: 'relative', width: width || '100%', maxWidth: width ? undefined : 420 }}>
      <button
        type="button"
        className="set-select"
        style={width ? { width, maxWidth: 'none' } : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{label}</span>
        <svg className="set-select__caret" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 4,
            boxShadow: 'var(--shadow-float)',
            zIndex: 10,
          }}
        >
          {options.map((o) => (
            <div key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                disabled={o.disabled}
                onClick={() => { if (o.disabled) return; onChange && onChange(o.value); setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                  minWidth: 0,
                  padding: '8px 10px',
                  border: 0,
                  background: o.value === value ? 'var(--bg-2)' : 'transparent',
                  borderRadius: 6,
                  font: 'inherit',
                  fontSize: 13,
                  textAlign: 'left',
                  cursor: o.disabled ? 'default' : 'pointer',
                  color: o.disabled ? 'var(--fg-5)' : 'var(--fg-1)',
                }}
                onMouseEnter={(e) => { if (!o.disabled && o.value !== value) e.currentTarget.style.background = 'var(--bg-1)'; }}
                onMouseLeave={(e) => { if (o.value !== value) e.currentTarget.style.background = 'transparent'; }}
              >
                <span>{o.label}</span>
                {o.value === value && <i data-lucide="check" style={{ width: 14, height: 14, color: 'var(--grain-green-500)' }} />}
              </button>
              {o.accessory && (
                <span style={{ flexShrink: 0, paddingRight: 4 }} onClick={(e) => { e.stopPropagation(); setOpen(false); }}>
                  {o.accessory}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`set-toggle ${checked ? 'is-on' : ''}`}
      aria-pressed={!!checked}
      onClick={() => onChange && onChange(!checked)}
    >
      <span className="set-toggle__thumb" />
    </button>
  );
}

function DiffFlag({ kind, children }) {
  return <span className={`diff-flag diff-flag--${kind}`}>{children}</span>;
}

function ChannelBadge({ kind }) {
  const map = {
    desktop: { label: 'Desktop capture', icon: 'audio-lines' },
    bot: { label: 'Grain Bot', icon: 'video' },
  };
  const m = map[kind] || map.desktop;
  return (
    <span className="set-mixed__chan">
      <i data-lucide={m.icon} /> {m.label}
    </span>
  );
}

function RadioCard({ icon, title, description, checked, onChange }) {
  return (
    <button
      type="button"
      className={`radio-card ${checked ? 'is-on' : ''}`}
      role="radio"
      aria-checked={!!checked}
      onClick={() => onChange && onChange()}
    >
      <span className="radio-card__radio" aria-hidden="true">
        <span className="radio-card__dot" />
      </span>
      {icon && (
        <span className="radio-card__icon" aria-hidden="true">
          <i data-lucide={icon} />
        </span>
      )}
      <span className="radio-card__text">
        <span className="radio-card__title">{title}</span>
        <span className="radio-card__desc">{description}</span>
      </span>
    </button>
  );
}

function MethodSegmented({ value, onChange }) {
  // Tiny 2-way segmented control for Bot vs Desktop in the customize matrix
  const options = [
    { value: 'bot', label: 'Grain Bot', icon: 'video' },
    { value: 'desktop', label: 'Desktop', icon: 'audio-lines' },
  ];
  return (
    <div className="method-seg" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`method-seg__btn ${value === o.value ? 'is-on' : ''}`}
          onClick={() => onChange && onChange(o.value)}
        >
          <i data-lucide={o.icon} />
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function FallbackToggle({ title, description, checked, onChange, isNew }) {
  return (
    <div className={`set-fallback ${checked ? 'is-on' : ''}`}>
      <div className="set-fallback__text">
        <p className="set-fallback__title">
          {title}
          {isNew && <DiffFlag kind="new">New</DiffFlag>}
        </p>
        <p className="set-fallback__desc">{description}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

Object.assign(window, { Chip, SubOption, OverrideRow, Select, ToggleSwitch, DiffFlag, ChannelBadge, FallbackToggle, RadioCard, MethodSegmented });
