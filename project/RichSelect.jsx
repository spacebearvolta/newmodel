// RichSelect.jsx — dropdown where each option has a title + description.
// Used for member-level pickers (Workspace Role, Seat, Status, etc.).
// Single-select (uniqueness via `value`) and multi-select (`values` array) variants.
// Options can mark themselves `danger: true` for destructive states like "Deactivate".

function RichSelectTrigger({ label, onClick, open }) {
  return (
    <button
      type="button"
      className={`rich-trigger ${open ? 'is-open' : ''}`}
      onClick={onClick}
      aria-expanded={open}
    >
      <span className="rich-trigger__label">{label}</span>
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 120ms' }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

function RichOption({ option, selected, onClick }) {
  return (
    <button
      type="button"
      className={`rich-opt ${selected ? 'is-on' : ''} ${option.danger ? 'is-danger' : ''}`}
      onClick={onClick}
      role="option"
      aria-selected={selected}
    >
      <span className="rich-opt__check" aria-hidden="true">
        {selected && (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className="rich-opt__text">
        <span className="rich-opt__title">{option.label}</span>
        {option.description && <span className="rich-opt__desc">{option.description}</span>}
      </span>
    </button>
  );
}

function useDropdown() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return { open, setOpen, ref };
}

function RichSelect({ value, options, onChange, width = 'auto', menuWidth = 360 }) {
  const { open, setOpen, ref } = useDropdown();
  const current = options.find((o) => o.value === value);
  return (
    <div ref={ref} className="rich-select" style={{ width }}>
      <RichSelectTrigger
        label={current ? current.label : 'Select…'}
        open={open}
        onClick={() => setOpen((o) => !o)}
      />
      {open && (
        <div className="rich-menu" role="listbox" style={{ width: menuWidth }}>
          {options.map((o) => (
            <RichOption
              key={o.value}
              option={o}
              selected={o.value === value}
              onClick={() => { onChange(o.value); setOpen(false); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RichMultiSelect({ values, options, onChange, formatTrigger, menuWidth = 360 }) {
  const { open, setOpen, ref } = useDropdown();
  const triggerLabel = formatTrigger
    ? formatTrigger(values, options)
    : (values.length === 0
        ? 'None'
        : values.length === 1
          ? options.find((o) => o.value === values[0])?.label || values[0]
          : `${values.length} selected`);
  const toggle = (val) => {
    const next = values.includes(val) ? values.filter((x) => x !== val) : [...values, val];
    onChange(next);
  };
  return (
    <div ref={ref} className="rich-select">
      <RichSelectTrigger label={triggerLabel} open={open} onClick={() => setOpen((o) => !o)} />
      {open && (
        <div className="rich-menu" role="listbox" style={{ width: menuWidth }}>
          {options.map((o) => (
            <RichOption
              key={o.value}
              option={o}
              selected={values.includes(o.value)}
              onClick={() => toggle(o.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { RichSelect, RichMultiSelect });
