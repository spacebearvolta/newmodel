// shell.jsx — Shared Grain app shell pieces used by both prototype flows.
// Components exported to window: Shell, Sidebar, Canvas, Icon, Modal, Stepper,
// Avatar, useStep.
//
// Avoid name collisions: keep this small and obvious; the prototypes import it
// before their own component scripts.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ── Icon: pulls from a small inline map of Lucide-shaped SVGs.
   We hand-code the strokes here so they survive offline. ───────────────── */
const ICONS = {
  search:   <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
  bell:     <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  video:    <><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></>,
  folder:   <><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></>,
  archive:  <><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></>,
  play:     <><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 8 6 4-6 4Z"/></>,
  megaphone:<><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>,
  plus:     <><path d="M5 12h14"/><path d="M12 5v14"/></>,
  help:     <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></>,
  lock:     <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  chevDown: <><path d="m6 9 6 6 6-6"/></>,
  chevRight:<><path d="m9 18 6-6-6-6"/></>,
  chevLeft: <><path d="m15 18-6-6 6-6"/></>,
  close:    <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  check:    <><path d="M20 6 9 17l-5-5"/></>,
  shield:   <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  building: <><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></>,
  user:     <><circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
  users:    <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  logout:   <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>,
  sparkles: <><path d="M12 2l1.6 4.8L18 8l-4.4 1.2L12 14l-1.6-4.8L6 8l4.4-1.2L12 2zm6 11l.9 2.6 2.6.9-2.6.9L18 20l-.9-2.6-2.6-.9 2.6-.9.9-2.6z"/></>,
  arrowRight: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
  arrowLeft:  <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
  arrowDown:  <><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></>,
  upgradeCircle: <><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></>,
  alert:    <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
  info:     <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></>,
  trash:    <><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></>,
  swap:     <><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></>,
  spark:    <><path d="m12 3-1.9 5.8L4 11l6.1 2.2L12 19l1.9-5.8L20 11l-6.1-2.2L12 3z"/></>,
  refresh:  <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
  briefcase:<><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  package:  <><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></>,
  zip:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 12v6"/><path d="M10 14h4"/><path d="M10 18h4"/></>,
  fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></>,
  send:     <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  ext:      <><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
  settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/></>,
  wrench:   <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></>,
  clock:    <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
  calendar: <><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></>,
  globe:    <><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></>,
  trophy:   <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>,
  hash:     <><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></>,
  tag:      <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></>,
  ellipsisV:<><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></>,
  slidersH: <><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></>,
  funnel:   <><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></>,
  audioLines: <><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></>,
  layers:   <><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></>,
  circlePlay: <><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4Z"/></>,
  graduationCap: <><path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
  circleAlert: <><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></>,
  dollarSign: <><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  banknote: <><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01"/><path d="M18 12h.01"/></>,
  creditCard: <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></>,
  landmark: <><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></>,
  chartBars: <><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></>,
  circleArrowDown: <><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></>,
  heart: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.04 3 5.5l7 7Z"/></>,
  infinity: <><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/></>,
  history:  <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>,
  terminal: <><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></>,
};
function Icon({ name, size = 16, stroke = 2, fill = 'none', style }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={name === 'sparkles' || name === 'spark' ? 'currentColor' : fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}>
      {path}
    </svg>
  );
}

/* ── Avatar (initials, deterministic color) ────────────────────────────── */
const AVATAR_COLORS = [
  ['#16A35F', '#fff'], ['#0052B4', '#fff'], ['#9747FF', '#fff'],
  ['#EA580C', '#fff'], ['#0EA5E9', '#fff'], ['#D946EF', '#fff'],
  ['#0B6F3F', '#fff'], ['#1F2937', '#fff'],
];
function Avatar({ name = '', size = 36 }) {
  const initials = name.split(' ').map(p => p[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
  const idx = useMemo(() => {
    let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
    return Math.abs(h) % AVATAR_COLORS.length;
  }, [name]);
  const [bg, fg] = AVATAR_COLORS[idx];
  return (
    <span className="user-row__avatar"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.round(size * 0.4) }}>
      {initials || '?'}
    </span>
  );
}

/* ── Modal: focus-trapped scrim + card. Renders nothing if not open. ──── */
function Modal({ open, onClose, children, size = 'md', danger = false, dismissible = true }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape' && dismissible) onClose?.(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, dismissible, onClose]);
  if (!open) return null;
  const cls = `modal modal--${size} ${danger ? 'modal--danger' : ''}`;
  return (
    <div className="scrim" onClick={(e) => { if (e.target === e.currentTarget && dismissible) onClose?.(); }}>
      <div className={cls} role="dialog" aria-modal="true">{children}</div>
    </div>
  );
}

function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      <span>Step {current + 1} of {steps.length}</span>
      <div className="stepper__dots">
        {steps.map((_, i) => (
          <span key={i} className={`stepper__dot ${i === current ? 'is-current' : i < current ? 'is-done' : ''}`}/>
        ))}
      </div>
    </div>
  );
}

/* ── Workspace switcher dropdown ──────────────────────────────────────── */
function WorkspaceSwitcher({ user, orgName = 'Personal', onStartTrial, onOrgAdmin, onSettings, onUpgrade, onIntegrations, hasOrg = false, adminPaused = false, isAdmin = true }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div ref={ref}>
      <button className={`ws ${open ? 'is-open' : ''}`} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <img className="ws__logo" src={(typeof window !== 'undefined' && window.__resources && window.__resources.grainLogo) || "assets/grain-logo.png"} alt="Grain"
             onError={(e) => { e.target.outerHTML = '<svg class="ws__logo" viewBox="0 0 36 36"><rect width="36" height="36" rx="9" fill="#16A35F"/><path d="M25 9.5c-1 8.5-6.2 13.7-14 14.8.4-7.6 5.9-13.6 14-14.8Z" fill="#fff"/></svg>'; }}/>
        <span className="ws__text">
          <span className="ws__name">{orgName}</span>
          <span className="ws__user">{user.name}</span>
        </span>
        <span className="ws__chev"><Icon name="chevDown"/></span>
      </button>

      {open && (
        <div className="ws-menu-pop" role="menu" onClick={(e) => e.stopPropagation()}>
          <button className="ws-menu-pop__item" role="menuitem"
                  onClick={() => { setOpen(false); onSettings?.(); }}>
            <Icon name="settings"/>
            <span>Settings</span>
          </button>

          {/* Organization settings is an admin affordance — members (the
              joiner persona) never see it. */}
          {isAdmin && (
            <div className="ws-menu-pop__item" role="menuitem" tabIndex={0}
                  title={adminPaused ? 'Admin settings, integrations, and the workspace API are disabled until the workspace is active.' : undefined}
                  onClick={() => { setOpen(false); onOrgAdmin?.(); }}>
            <Icon name="wrench"/>
            <span>Organization settings</span>
            {adminPaused && (
              <button className="ws-menu-pop__trial"
                      onClick={(e) => { e.stopPropagation(); setOpen(false); onUpgrade?.(); }}>
                <span className="btn-label">Upgrade</span>
              </button>
            )}
            {!hasOrg && onStartTrial && (
              <button className="ws-menu-pop__trial"
                      onClick={(e) => { e.stopPropagation(); setOpen(false); onStartTrial(); }}>
                <span className="btn-label">Start trial</span>
              </button>
            )}
            </div>
          )}

          {/* Integrations — personal settings entry point, below Org settings */}
          <button className="ws-menu-pop__item" role="menuitem"
                  onClick={() => { setOpen(false); onIntegrations?.(); }}>
            <Icon name="package"/>
            <span>Integrations</span>
          </button>

          <div className="ws-menu-pop__divider"/>

          <button className="ws-menu-pop__item" role="menuitem"
                  onClick={() => { setOpen(false); onUpgrade?.(); }}>
            <Icon name="upgradeCircle"/>
            <span>Upgrade plan</span>
          </button>

          <div className="ws-menu-pop__divider"/>

          <button className="ws-menu-pop__item is-danger" role="menuitem">
            <Icon name="logout"/>
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Replay (resets state) ────────────────────────────────────────────── */
function Replay({ onClick, label = 'Replay' }) {
  return (
    <button className="replay" onClick={onClick}>
      <Icon name="refresh"/> {label}
    </button>
  );
}

/* ── Meeting views (org-only tabs) ─────────────────────────────────────
   Built-in views ("My meetings", "All meetings") sit before a divider;
   custom team views follow. The "+" creates a new filtered view (flow not
   prototyped here). Each view maps to a different slice of the org's
   meetings via meetingsForView(). ───────────────────────────────────── */
const ORG_VIEWS = [
  { id: 'mine', label: 'My meetings' },
  { id: 'all',  label: 'Team meetings' },
  { id: 'exec', label: 'Executive Team', dividerBefore: true },
  { id: 'newteam', label: 'New Team' },
  { id: 'grain', label: 'Grain' },
  { id: 'cs',   label: 'Customer Success' },
  { id: 'sales', label: 'Sales' },
];

// Org-wide meetings keyed by view. "mine" is supplied by the flow (so the
// hasMeetings toggle keeps working); every other view is org data with
// per-meeting owners so the list reads like a shared workspace.
const ORG_MEETINGS_BY_VIEW = {
  all: [
    { id: 'a1', title: 'Northwind renewal — exec sync',   attendees: '5 people',  duration: '42 min', date: 'May 30', owner: 'Maya Chen' },
    { id: 'a2', title: 'Q3 board deck review',            attendees: '4 people',  duration: '58 min', date: 'May 29', owner: 'Devon Rao' },
    { id: 'a3', title: 'Engineering all-hands',           attendees: '22 people', duration: '35 min', date: 'May 28', owner: 'Priya Sundaram' },
    { id: 'a4', title: 'Customer interview — Beacon',     attendees: '3 people',  duration: '47 min', date: 'May 27', owner: 'Nina Park' },
    { id: 'a5', title: 'Pricing & packaging workshop',    attendees: '8 people',  duration: '61 min', date: 'May 26', owner: 'Jordan Lee' },
    { id: 'a6', title: 'Support escalation review',       attendees: '4 people',  duration: '29 min', date: 'May 23', owner: 'Sam Okafor' },
  ],
  exec: [
    { id: 'e1', title: 'Q3 board deck review',     attendees: '4 people', duration: '58 min', date: 'May 29', owner: 'Devon Rao' },
    { id: 'e2', title: 'Leadership weekly sync',   attendees: '6 people', duration: '45 min', date: 'May 27', owner: 'Maya Chen' },
    { id: 'e3', title: 'Hiring plan — H2',         attendees: '5 people', duration: '38 min', date: 'May 22', owner: 'Devon Rao' },
  ],
  newteam: [],
  grain: [
    { id: 'g1', title: 'Engineering all-hands',  attendees: '22 people', duration: '35 min', date: 'May 28', owner: 'Priya Sundaram' },
    { id: 'g2', title: 'Roadmap planning',       attendees: '9 people',  duration: '54 min', date: 'May 25', owner: 'Jordan Lee' },
    { id: 'g3', title: 'Company kickoff',        attendees: '31 people', duration: '40 min', date: 'May 19', owner: 'Maya Chen' },
  ],
  cs: [
    { id: 'c1', title: 'Beacon onboarding kickoff', attendees: '4 people', duration: '39 min', date: 'May 21', owner: 'Nina Park' },
    { id: 'c2', title: 'QBR — Northwind',           attendees: '6 people', duration: '52 min', date: 'May 20', owner: 'Nina Park' },
    { id: 'c3', title: 'Renewal risk review',       attendees: '3 people', duration: '27 min', date: 'May 18', owner: 'Sam Okafor' },
  ],
  sales: [
    { id: 's1', title: 'Acme × Northwind — Discovery', attendees: '5 people', duration: '48 min', date: 'May 27', owner: 'Alex Beckett' },
    { id: 's2', title: 'Demo — Helix Corp',            attendees: '4 people', duration: '33 min', date: 'May 24', owner: 'Maya Chen' },
    { id: 's3', title: 'Pipeline review',              attendees: '5 people', duration: '36 min', date: 'May 16', owner: 'Jordan Lee' },
  ],
};

function meetingsForView(viewId, mine) {
  if (viewId === 'mine') return mine;
  return ORG_MEETINGS_BY_VIEW[viewId] || [];
}

const VIEW_EMPTY = {
  newteam: {
    title: 'No meetings in this view yet',
    sub: 'New Team was just created. Meetings matching its filters will show up here as they’re captured.',
  },
  _default: {
    title: 'No meetings in this view',
    sub: 'Meetings matching this view’s filters will appear here.',
  },
};

function ViewTabs({ views, activeId, onChange, onAdd, lockedIds, onLockedClick, addDivider }) {
  const locked = lockedIds instanceof Set ? lockedIds : new Set(lockedIds || []);
  return (
    <div className="view-tabs" role="tablist" aria-label="Meeting views">
      {views.map((v) => {
        const isLocked = locked.has(v.id);
        const isActive = v.id === activeId && !isLocked;
        return (
          <React.Fragment key={v.id}>
            {v.dividerBefore && <span className="view-tabs__sep" aria-hidden="true" />}
            <button
              role="tab"
              aria-selected={isActive}
              className={`view-tab ${isActive ? 'is-active' : ''} ${isLocked ? 'is-locked' : ''}`}
              title={isLocked ? 'Paused — reactivate to use this view' : undefined}
              onClick={() => (isLocked ? onLockedClick?.(v) : onChange?.(v.id))}>
              {v.label}
              {isLocked && <span className="view-tab__lock" aria-hidden="true"><Icon name="lock" size={12} /></span>}
            </button>
          </React.Fragment>
        );
      })}
      {addDivider && <span className="view-tabs__sep" aria-hidden="true" />}
      <button className="view-tabs__add" aria-label="Create view" title="Create view" onClick={onAdd}>
        <Icon name="plus" size={17} />
      </button>
    </div>
  );
}

/* ── Canvas placeholder: mock "Meetings" list to fill the right side ──── */
function MeetingsPlaceholder({ meetings, ownerLabel = 'Jeff', emptyText, emptyTitle }) {
  if (!meetings.length) {
    const SkelRow = ({ chip }) => (
      <div className="mt-empty-row">
        <span className="mt-empty-row__thumb"><Icon name="video" size={13} /></span>
        <span className="mt-empty-row__bars">
          <i style={{ width: '64%' }} />
          <i style={{ width: '38%' }} />
        </span>
        <span className="mt-empty-row__avatar" />
        <span className="mt-empty-row__chip" style={{ background: chip }} />
        <span className="mt-empty-row__count"><Icon name="users" size={12} /></span>
        <span className="mt-empty-row__more" />
      </div>
    );
    return (
      <div className="mt-empty">
        <div className="mt-empty__preview" aria-hidden="true">
          <div className="mt-empty__panel">
            <div className="mt-empty__panel-head">
              <span className="mt-empty__panel-title"><Icon name="video" size={14} /> Meetings</span>
              <span className="mt-empty__add"><Icon name="plus" size={12} /> Add</span>
            </div>
            <SkelRow chip="#9747FF" />
            <SkelRow chip="#0EA5E9" />
            <SkelRow chip="#EA4335" />
          </div>
        </div>
        <div className="mt-empty__title">{emptyTitle || 'No meetings have been captured yet'}</div>
        <div className="mt-empty__sub">{emptyText || 'Meetings captured by Grain that you were a part of will appear here.'}</div>
      </div>
    );
  }
  return (
    <div className="meetings">
      {meetings.map(m => (
        <div key={m.id} className="meeting-row">
          <div className="meeting-row__thumb"><Icon name="video"/></div>
          <div>
            <div className="meeting-row__title">{m.title}</div>
            <div className="meeting-row__meta">{m.attendees} · {m.duration}</div>
          </div>
          <div className="meeting-row__date">{m.date}</div>
          <div className="meeting-row__owner">
            {m.owner
              ? <Avatar name={m.owner} size={22} />
              : <span className="avatar">{ownerLabel[0]}</span>}
            <span>{m.owner || ownerLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Toast ────────────────────────────────────────────────────────────── */
function Toast({ children }) {
  return <div className="toast"><Icon name="check" size={14}/> {children}</div>;
}

/* ── Global "New" create menu ─────────────────────────────────────────
   Sits under the workspace switcher; the dropdown lists the ways to start
   a new meeting — matches the production dropdown screenshot. */
const NEW_MENU_ITEMS = [
  { id: 'bot',     icon: 'video',           title: 'Bot recording',  sub: 'Record, transcribe, & summarize a meeting' },
  { id: 'desktop', icon: 'audioLines',      title: 'Desktop capture', sub: 'Transcribe and summarize a meeting' },
  { id: 'upload',  icon: 'upload',          title: 'File upload',     sub: 'Transcribe & summarize existing recordings' },
  { id: 'zoom',    icon: 'circleArrowDown', title: 'Zoom import',     sub: 'Import recordings from your Zoom account' },
];

function GlobalNew({ items = NEW_MENU_ITEMS, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
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
          {items.map((it) => (
            <button key={it.id} className="new-menu-pop__item" role="menuitem"
                    onClick={() => { setOpen(false); onSelect?.(it.id); }}>
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

/* ── Sidebar (shared shell — home layout) ─────────────────────────────── */
function Sidebar({ user, orgName = 'Personal', hasOrg = false, adminPaused = false, isAdmin = true, onStartTrial, onOrgAdmin, onSettings, onUpgrade, updatesBadge, onUpdatesClick, promoCard, onNew, onInvite, onIntegrations }) {
  const navItems = [
    { id: 'search',    label: 'Search',    icon: 'search' },
    { id: 'updates',   label: 'Updates',   icon: 'bell', badge: updatesBadge, onClick: onUpdatesClick },
    { id: 'meetings',  label: 'Meetings',  icon: 'video', active: true },
    { id: 'playlists', label: 'Playlists', icon: 'layers', gapBefore: true },
    { id: 'stories',   label: 'Stories',   icon: 'circlePlay' },
    { id: 'coaching',  label: 'Coaching',  icon: 'graduationCap', badge: '4' },
  ];
  return (
    <aside className="side">
      <WorkspaceSwitcher
        user={user}
        orgName={orgName}
        hasOrg={hasOrg}
        adminPaused={adminPaused}
        isAdmin={isAdmin}
        onSettings={onSettings}
        onOrgAdmin={onOrgAdmin}
        onUpgrade={onUpgrade}
        onIntegrations={onIntegrations}
        onStartTrial={hasOrg ? null : onStartTrial}/>
      <GlobalNew onSelect={onNew} />
      <nav className="nav" aria-label="Primary">
        {navItems.map(it => (
          <React.Fragment key={it.id}>
            {it.gapBefore && <div className="nav__gap" aria-hidden="true"></div>}
            <button
                  className={`nav__item ${it.active ? 'is-active' : ''}`}
                  aria-current={it.active ? 'page' : undefined}
                  onClick={it.onClick}>
              <Icon name={it.icon}/>
              <span>{it.label}</span>
              {it.badge ? <span className="badge">{it.badge}</span> : null}
            </button>
          </React.Fragment>
        ))}
      </nav>
      <div className="spacer"/>
      {promoCard}
      <div className="foot">
        <button className="invite-btn" onClick={onInvite}><Icon name="plus"/> <span className="btn-label">Invite</span></button>
        <button className="help"><Icon name="help"/></button>
      </div>
    </aside>
  );
}

Object.assign(window, {
  Icon, Avatar, Modal, Stepper, WorkspaceSwitcher, Replay, MeetingsPlaceholder, Toast, Sidebar,
  GlobalNew, ViewTabs, ORG_VIEWS, meetingsForView, VIEW_EMPTY,
});
