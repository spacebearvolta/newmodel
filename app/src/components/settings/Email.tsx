// Email.tsx — Email notifications subpage (reached from Preferences → Notification channels → Email)
import { useState } from 'react';
import { Icon } from '../primitives/Icon';
import { ToggleSwitch } from './Primitives';

interface State {
  personalRecaps: boolean;
}

export function EmailNotifications({ onBack }: { onBack: () => void }) {
  const [s, setS] = useState<State>({ personalRecaps: true });
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));

  const ToggleRow = ({ title, desc, valueKey, isFirst }: { title: string; desc: string; valueKey: keyof State; isFirst?: boolean }) => (
    <div className={`set-row ${isFirst ? '' : 'set-row--continuation'}`}>
      <div className="set-inline">
        <div className="set-inline__text">
          <p className="set-inline__title">{title}</p>
          <p className="set-inline__desc">{desc}</p>
        </div>
        <ToggleSwitch checked={s[valueKey]} onChange={(v) => set(valueKey, v)} />
      </div>
    </div>
  );

  const TrialRow = ({ title, desc, isFirst }: { title: string; desc: string; isFirst?: boolean }) => (
    <div className={`set-row ${isFirst ? '' : 'set-row--continuation'}`}>
      <div className="set-inline">
        <div className="set-inline__text">
          <p className="set-inline__title">{title}</p>
          <p className="set-inline__desc">{desc}</p>
        </div>
        <button type="button" className="set-upsell__cta">Start trial</button>
      </div>
    </div>
  );

  return (
    <div className="set-page">
      <header className="set-page__head">
        <a className="set-page__breadcrumb" href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
          <Icon name="chevLeft" size={14} />
          <span>Preferences</span>
        </a>
        <h1 className="set-page__title">Email</h1>
        <p className="set-page__sub">Configure your email updates.</p>
      </header>

      <section className="set-section">
        <div className="set-card">
          <ToggleRow isFirst title="Personal meeting recaps" desc="Get summaries and action items for all meetings you're in sent to your inbox." valueKey="personalRecaps" />
          <TrialRow title="Organization meeting recaps" desc="Get summaries and action items for all meetings you have access to in your organization sent to your inbox." />
        </div>
      </section>
    </div>
  );
}
