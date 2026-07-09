import { useCallback, useEffect, useState } from 'react';
import { Icon } from './primitives/Icon';
import { HG_HOOKS } from '../data/hooks';
import { buildViewUrl } from './tweaks/TweaksPanel';

// A reviewer slideshow of every upgrade/trial hook in the app. Renders each
// hook one at a time on a dark stage (a faint app silhouette behind for
// context), with prev/next, optional state switches (e.g. grace-day
// counts), and the trigger description.
interface HookGalleryProps {
  open: boolean;
  onClose?: () => void;
}

export function HookGallery({ open, onClose }: HookGalleryProps) {
  const [i, setI] = useState(0);
  const [s, setS] = useState(0);
  const hook = HG_HOOKS[i];

  const go = useCallback((delta: number) => {
    setI((prev) => Math.min(HG_HOOKS.length - 1, Math.max(0, prev + delta)));
    setS(0);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go, onClose]);

  useEffect(() => {
    if (open) {
      setI(0);
      setS(0);
    }
  }, [open]);

  if (!open || !hook) return null;

  return (
    <div className="hg-overlay">
      <div className="hg-context" aria-hidden="true">
        <div className="hg-context__side" />
        <div className="hg-context__row" style={{ top: 90 }} />
        <div className="hg-context__row" style={{ top: 160 }} />
        <div className="hg-context__row" style={{ top: 230 }} />
        <div className="hg-context__row" style={{ top: 300 }} />
        <div className="hg-context__row" style={{ top: 370 }} />
      </div>

      {hook.kind === 'inline' ? (
        <div className="hg-stage" key={`${i}-${s}`}>
          {hook.render(s)}
        </div>
      ) : (
        <div key={`${i}-${s}`}>{hook.render(s)}</div>
      )}

      <div className="hg-top">
        <span className="hg-top__label">
          <Icon name="sparkles" size={14} /> Hook gallery
          <span className="hg-top__count">
            {i + 1} / {HG_HOOKS.length}
          </span>
        </span>
        <button className="hg-close" aria-label="Close gallery" onClick={onClose}>
          <Icon name="close" size={18} />
        </button>
      </div>

      <button className="hg-nav hg-nav--prev" aria-label="Previous" disabled={i === 0} onClick={() => go(-1)}>
        <Icon name="chevLeft" size={22} />
      </button>
      <button className="hg-nav hg-nav--next" aria-label="Next" disabled={i === HG_HOOKS.length - 1} onClick={() => go(1)}>
        <Icon name="chevRight" size={22} />
      </button>

      <div className="hg-bottom">
        <span className="hg-bottom__tag">{hook.tag}</span>
        {(() => {
          const ctx = (hook.contexts && hook.contexts[s]) || hook.context;
          return (
            <div className="hg-bottom__title">
              {hook.title}
              {ctx && (
                <>
                  {' — '}
                  <a className="hg-view" href={buildViewUrl(ctx.route, ctx.tweaks, ctx.show)}>
                    View in prototype <Icon name="arrowRight" size={13} />
                  </a>
                </>
              )}
            </div>
          );
        })()}
        <p className="hg-bottom__desc">{hook.trigger}</p>
        {hook.states && (
          <div className="hg-states" role="tablist" aria-label="States">
            {hook.states.map((label, idx) => (
              <button key={label} className={`hg-state ${idx === s ? 'is-on' : ''}`} onClick={() => setS(idx)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
