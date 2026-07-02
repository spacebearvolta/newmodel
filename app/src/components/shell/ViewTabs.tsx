import { Fragment } from 'react';
import { Icon } from '../primitives/Icon';
import type { ViewDef } from '../../data/meetings';

interface ViewTabsProps {
  views: ViewDef[];
  activeId: string;
  onChange?: (id: string) => void;
  onAdd?: () => void;
  lockedIds?: Set<string> | string[];
  onLockedClick?: (v: ViewDef) => void;
  addDivider?: boolean;
}

export function ViewTabs({ views, activeId, onChange, onAdd, lockedIds, onLockedClick, addDivider }: ViewTabsProps) {
  const locked = lockedIds instanceof Set ? lockedIds : new Set(lockedIds || []);
  return (
    <div className="view-tabs" role="tablist" aria-label="Meeting views">
      {views.map((v) => {
        const isLocked = locked.has(v.id);
        const isActive = v.id === activeId && !isLocked;
        return (
          <Fragment key={v.id}>
            {v.dividerBefore && <span className="view-tabs__sep" aria-hidden="true" />}
            <button
              role="tab"
              aria-selected={isActive}
              className={`view-tab ${isActive ? 'is-active' : ''} ${isLocked ? 'is-locked' : ''}`}
              title={isLocked ? 'Paused — reactivate to use this view' : undefined}
              onClick={() => (isLocked ? onLockedClick?.(v) : onChange?.(v.id))}
            >
              {v.label}
              {isLocked && <span className="view-tab__lock" aria-hidden="true"><Icon name="lock" size={12} /></span>}
            </button>
          </Fragment>
        );
      })}
      {addDivider && <span className="view-tabs__sep" aria-hidden="true" />}
      <button className="view-tabs__add" aria-label="Create view" title="Create view" onClick={onAdd}>
        <Icon name="plus" size={17} />
      </button>
    </div>
  );
}
