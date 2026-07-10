import type { ReactNode } from 'react';
import { Icon } from '../primitives/Icon';

export function Toast({ children, icon = 'check' }: { children: ReactNode; icon?: string }) {
  return (
    <div className="toast">
      <span className="toast__icon"><Icon name={icon} size={15} /></span> {children}
    </div>
  );
}
