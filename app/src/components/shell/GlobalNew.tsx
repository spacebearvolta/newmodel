import { useEffect, useRef, useState } from 'react';
import { Icon } from '../primitives/Icon';

const NEW_MENU_ITEMS = [
  { id: 'bot', icon: 'video', title: 'Bot recording', sub: 'Record, transcribe, & summarize a meeting' },
  { id: 'desktop', icon: 'audioLines', title: 'Desktop capture', sub: 'Transcribe and summarize a meeting' },
  { id: 'upload', icon: 'upload', title: 'File upload', sub: 'Transcribe & summarize existing recordings' },
  { id: 'zoom', icon: 'circleArrowDown', title: 'Zoom import', sub: 'Import recordings from your Zoom account' },
];

export function GlobalNew({ onSelect }: { onSelect?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="side-new-wrap" ref={ref}>
      <button className="side-new" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="plus" /> <span className="btn-label">New</span>
      </button>
      {open && (
        <div className="new-menu-pop" role="menu">
          {NEW_MENU_ITEMS.map((it) => (
            <button key={it.id} className="new-menu-pop__item" role="menuitem" onClick={() => { setOpen(false); onSelect?.(it.id); }}>
              <Icon name={it.icon} />
              <span className="new-menu-pop__text">
                <span className="new-menu-pop__title">{it.title}</span>
                <span className="new-menu-pop__sub">{it.sub}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
