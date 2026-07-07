import { useEffect, useRef, useState } from 'react';
import { Icon } from '../primitives/Icon';

interface NewMenuItem {
  id: string;
  icon: string;
  title: string;
  sub: string;
  // Desktop capture relies on the native Grain desktop app, so it can't run
  // on mobile/tablet. We keep it visible (it advertises a key capability) but
  // disable it below the desktop breakpoint and explain why.
  desktopOnly?: boolean;
}

const NEW_MENU_ITEMS: NewMenuItem[] = [
  { id: 'bot', icon: 'video', title: 'Bot recording', sub: 'Record, transcribe, & summarize a meeting' },
  { id: 'desktop', icon: 'audioLines', title: 'Desktop capture', sub: 'Transcribe and summarize a meeting', desktopOnly: true },
  { id: 'upload', icon: 'upload', title: 'File upload', sub: 'Transcribe & summarize existing recordings' },
  { id: 'zoom', icon: 'circleArrowDown', title: 'Zoom import', sub: 'Import recordings from your Zoom account' },
];

// Below this viewport width we treat the device as small/medium (phone or
// tablet), where Desktop capture is unavailable.
const DESKTOP_MIN_WIDTH = 1024;

function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(`(max-width: ${DESKTOP_MIN_WIDTH - 1}px)`).matches
      : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(`(max-width: ${DESKTOP_MIN_WIDTH - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isSmall;
}

export function GlobalNew({ onSelect }: { onSelect?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isSmallScreen = useIsSmallScreen();

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
          {NEW_MENU_ITEMS.map((it) => {
            const disabled = it.desktopOnly && isSmallScreen;
            return (
              <button
                key={it.id}
                className={`new-menu-pop__item ${disabled ? 'is-disabled' : ''}`}
                role="menuitem"
                disabled={disabled}
                aria-disabled={disabled || undefined}
                onClick={disabled ? undefined : () => { setOpen(false); onSelect?.(it.id); }}
              >
                <Icon name={it.icon} />
                <span className="new-menu-pop__text">
                  <span className="new-menu-pop__title">{it.title}</span>
                  <span className="new-menu-pop__sub">{it.sub}</span>
                  {disabled && <span className="new-menu-pop__note">Requires Grain desktop app</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
