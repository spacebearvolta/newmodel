import { useState } from 'react';
import { HookGallery } from '../components/HookGallery';
import { Icon } from '../components/primitives/Icon';

// Dev-only route preserving the pixel-perfect Hook Gallery reviewer tool —
// previously the app's root, now reachable at /hook-gallery once the real
// app took over "/". Untouched from the original baseline.
export function HookGalleryRoute() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className="btn btn--dark btn--pill btn--lg" onClick={() => setOpen(true)}>
          <Icon name="sparkles" size={14} />
          <span className="btn-label">Open Hook Gallery</span>
        </button>
      </div>
    );
  }

  return <HookGallery open={open} onClose={() => setOpen(false)} />;
}
