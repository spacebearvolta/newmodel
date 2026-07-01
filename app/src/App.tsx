import { useState } from 'react';
import { HookGallery } from './components/HookGallery';
import { Icon } from './components/primitives/Icon';

function App() {
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

export default App;
