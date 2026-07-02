import type { ReactNode } from 'react';
import { Icon } from '../primitives/Icon';

export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="toast">
      <Icon name="check" size={14} /> {children}
    </div>
  );
}
