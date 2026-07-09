import { useEffect, useRef, useState } from 'react';
import { Icon } from '../primitives/Icon';
import grainLogo from '../../assets/grain-logo.png';

interface WorkspaceSwitcherProps {
  user: { name: string; email: string };
  orgName?: string;
  onStartTrial?: () => void;
  onOrgAdmin?: () => void;
  onSettings?: () => void;
  onUpgrade?: () => void;
  onIntegrations?: () => void;
  hasOrg?: boolean;
  adminPaused?: boolean;
  isAdmin?: boolean;
}

export function WorkspaceSwitcher({
  user, orgName = 'Personal', onStartTrial, onOrgAdmin, onSettings, onUpgrade, onIntegrations,
  hasOrg = false, adminPaused = false, isAdmin = true,
}: WorkspaceSwitcherProps) {
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
    <div ref={ref} style={{ position: 'relative' }}>
      <button className={`ws ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <img className="ws__logo" src={grainLogo} alt="Grain" />
        <span className="ws__text">
          <span className="ws__name">{orgName}</span>
          <span className="ws__user">{user.name}</span>
        </span>
        <span className="ws__chev"><Icon name="chevDown" /></span>
      </button>

      {open && (
        <div className="ws-menu-pop" role="menu" onClick={(e) => e.stopPropagation()}>
          <button className="ws-menu-pop__item" role="menuitem" onClick={() => { setOpen(false); onSettings?.(); }}>
            <Icon name="settings" />
            <span>Settings</span>
          </button>

          {isAdmin && (
            <div
              className="ws-menu-pop__item" role="menuitem" tabIndex={0}
              title={adminPaused ? 'Admin settings, integrations, and the workspace API are disabled until the workspace is active.' : undefined}
              onClick={() => { setOpen(false); onOrgAdmin?.(); }}
            >
              <Icon name="wrench" />
              <span>Organization settings</span>
              {adminPaused && (
                <button className="ws-menu-pop__trial" onClick={(e) => { e.stopPropagation(); setOpen(false); onUpgrade?.(); }}>
                  <span className="btn-label">Upgrade</span>
                </button>
              )}
              {!hasOrg && onStartTrial && (
                <button className="ws-menu-pop__trial ws-menu-pop__trial--dark" onClick={(e) => { e.stopPropagation(); setOpen(false); onStartTrial(); }}>
                  <span className="btn-label">Start trial</span>
                </button>
              )}
            </div>
          )}

          <button className="ws-menu-pop__item" role="menuitem" onClick={() => { setOpen(false); onIntegrations?.(); }}>
            <Icon name="layoutGrid" />
            <span>Integrations</span>
          </button>

          <div className="ws-menu-pop__divider" />

          <button className="ws-menu-pop__item" role="menuitem" onClick={() => { setOpen(false); onUpgrade?.(); }}>
            <Icon name="upgradeCircle" />
            <span>Upgrade plan</span>
          </button>

          <div className="ws-menu-pop__divider" />

          <button className="ws-menu-pop__item is-danger" role="menuitem">
            <Icon name="logout" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
