// Primitives.tsx — checkbox chips, dropdowns, toggles, override line, radio
// cards. Ported from Primitives.jsx (the Settings-pages primitive kit,
// distinct from components/primitives which back the Meetings/hooks flows).
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../primitives/Icon';

export function Chip({ label, checked, onChange }: { label: string; checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button type="button" className={`chip ${checked ? 'is-on' : ''}`} aria-pressed={!!checked} onClick={() => onChange?.(!checked)}>
      <span className="chip__box" aria-hidden="true">
        <span className="chip__check"><Icon name="check" size={10} stroke={3} /></span>
      </span>
      <span>{label}</span>
    </button>
  );
}

export function SubOption({ label, checked, onChange }: { label: string; checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className={`set-suboption ${checked ? 'is-on' : ''}`} onClick={(e) => { e.preventDefault(); onChange?.(!checked); }}>
      <span className="set-suboption__box" aria-hidden="true">
        <span className="set-suboption__check"><Icon name="check" size={10} stroke={3} /></span>
      </span>
      <span>{label}</span>
    </label>
  );
}

export function OverrideRow({ shown, onReset }: { shown?: boolean; onReset?: () => void }) {
  if (!shown) return null;
  return (
    <div className="set-override">
      <span>You've overridden your team's default setting.</span>
      <button type="button" className="set-override__reset" onClick={onReset}>Reset</button>
    </div>
  );
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  accessory?: ReactNode;
}

export function Select({ value, options, onChange, width }: { value: string | number; options: SelectOption[]; onChange?: (v: string | number) => void; width?: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const label = options.find((o) => o.value === value)?.label ?? value;
  return (
    <div ref={ref} style={{ position: 'relative', width: width || '100%', maxWidth: width ? undefined : 420 }}>
      <button type="button" className="set-select" style={width ? { width, maxWidth: 'none' } : undefined} onClick={() => setOpen((o) => !o)}>
        <span>{label}</span>
        <Icon name="chevDown" size={14} style={{ flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4, boxShadow: 'var(--shadow-float)', zIndex: 10 }}>
          {options.map((o) => (
            <div key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                disabled={o.disabled}
                onClick={() => { if (o.disabled) return; onChange?.(o.value); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, minWidth: 0,
                  padding: '8px 10px', border: 0, background: o.value === value ? 'var(--bg-2)' : 'transparent',
                  borderRadius: 6, font: 'inherit', fontSize: 13, textAlign: 'left',
                  cursor: o.disabled ? 'default' : 'pointer', color: o.disabled ? 'var(--fg-5)' : 'var(--fg-1)',
                }}
              >
                <span>{o.label}</span>
                {o.value === value && <Icon name="check" size={14} style={{ color: 'var(--grain-green-500)' }} />}
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

export function ToggleSwitch({ checked, onChange }: { checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button type="button" className={`set-toggle ${checked ? 'is-on' : ''}`} role="switch" aria-checked={!!checked} onClick={() => onChange?.(!checked)}>
      <span className="set-toggle__thumb" />
    </button>
  );
}

export function RadioCard({ icon, title, description, checked, onChange }: {
  icon?: string; title: string; description: string; checked?: boolean; onChange?: () => void;
}) {
  return (
    <button type="button" className={`radio-card ${checked ? 'is-on' : ''}`} role="radio" aria-checked={!!checked} onClick={() => onChange?.()}>
      <span className="radio-card__radio" aria-hidden="true"><span className="radio-card__dot" /></span>
      {icon && <span className="radio-card__icon" aria-hidden="true"><Icon name={icon} size={20} stroke={2.25} /></span>}
      <span className="radio-card__text">
        <span className="radio-card__title">{title}</span>
        <span className="radio-card__desc">{description}</span>
      </span>
    </button>
  );
}
