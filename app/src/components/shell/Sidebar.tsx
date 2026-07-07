import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../primitives/Icon';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { GlobalNew } from './GlobalNew';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  badge?: string;
  gapBefore?: boolean;
  onClick?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'updates', label: 'Updates', icon: 'bell' },
  { id: 'meetings', label: 'Meetings', icon: 'video', active: true },
  { id: 'playlists', label: 'Playlists', icon: 'layers', gapBefore: true },
  { id: 'stories', label: 'Stories', icon: 'circlePlay' },
  { id: 'coaching', label: 'Coaching', icon: 'megaphone', badge: '4' },
];

interface SidebarProps {
  user: { name: string; email: string };
  orgName?: string;
  hasOrg?: boolean;
  adminPaused?: boolean;
  isAdmin?: boolean;
  onStartTrial?: () => void;
  onOrgAdmin?: () => void;
  onSettings?: () => void;
  onUpgrade?: () => void;
  updatesBadge?: string;
  onUpdatesClick?: () => void;
  promoCard?: ReactNode;
  onNew?: (id: string) => void;
  onInvite?: () => void;
  onIntegrations?: () => void;
}

export function Sidebar({
  user, orgName = 'Personal', hasOrg = false, adminPaused = false, isAdmin = true,
  onStartTrial, onOrgAdmin, onSettings, onUpgrade, updatesBadge, onUpdatesClick,
  promoCard, onNew, onInvite, onIntegrations,
}: SidebarProps) {
  const navItems = NAV_ITEMS.map((it) => it.id === 'updates' ? { ...it, badge: updatesBadge, onClick: onUpdatesClick } : it);
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
        onStartTrial={hasOrg ? undefined : onStartTrial}
      />
      <GlobalNew onSelect={onNew} />
      <nav className="nav" aria-label="Primary">
        {navItems.map((it) => (
          <Fragment key={it.id}>
            {it.gapBefore && <div className="nav__gap" aria-hidden="true" />}
            <button className={`nav__item ${it.active ? 'is-active' : ''}`} aria-current={it.active ? 'page' : undefined} onClick={it.onClick}>
              <Icon name={it.icon} />
              <span>{it.label}</span>
              {it.badge ? <span className="badge">{it.badge}</span> : null}
            </button>
          </Fragment>
        ))}
      </nav>
      <div className="spacer" />
      {promoCard}
      <div className="foot">
        <button className="invite-btn" onClick={onInvite}><Icon name="plus" /> <span className="btn-label">Invite</span></button>
        <button className="help"><Icon name="help" /></button>
      </div>
    </aside>
  );
}
