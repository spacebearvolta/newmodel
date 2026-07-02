import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  dismissible?: boolean;
  // Skip the `.modal.modal--{size}` card wrapper — used by v2 hook designs
  // that bring their own self-contained card styling (.modal-v2 .card-v2)
  // and would otherwise end up double-boxed inside Modal's own card.
  bare?: boolean;
}

export function Modal({ open, onClose, children, size = 'md', dismissible = true, bare = false }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) onClose?.();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, dismissible, onClose]);

  if (!open) return null;
  return (
    <div
      className="scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget && dismissible) onClose?.();
      }}
    >
      {bare ? (
        <div role="dialog" aria-modal="true">{children}</div>
      ) : (
        <div className={`modal modal--${size}`} role="dialog" aria-modal="true">
          {children}
        </div>
      )}
    </div>
  );
}
