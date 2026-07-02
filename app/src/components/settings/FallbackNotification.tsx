// FallbackNotification.tsx — macOS notification card shown when fallback fires.
import grainLogo from '../../assets/grain-logo.png';

function ZoomIcon() {
  return (
    <span className="notif-app notif-app--zoom" aria-hidden="true">
      <svg viewBox="0 0 44 44" width="100%" height="100%">
        <rect x="1" y="1" width="42" height="42" rx="9" fill="#2D8CFF" />
        <g transform="translate(8,14)">
          <rect x="0" y="0" width="18" height="16" rx="3" fill="#fff" />
          <path d="M18 5 L28 1 L28 15 L18 11 Z" fill="#fff" />
        </g>
      </svg>
    </span>
  );
}

function GrainIcon() {
  return (
    <span className="notif-app notif-app--grain" aria-hidden="true">
      <img src={grainLogo} alt="" />
    </span>
  );
}

function FallbackNotification({ variant }: { variant: 'bot-failed' | 'desktop-failed' }) {
  const botIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M22 8l-6 4 6 4V8z" />
    </svg>
  );
  const desktopIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="12" x2="3" y2="12" />
      <line x1="7" y1="9" x2="7" y2="15" />
      <line x1="11" y1="6" x2="11" y2="18" />
      <line x1="15" y1="9" x2="15" y2="15" />
      <line x1="19" y1="11" x2="19" y2="13" />
    </svg>
  );
  const cfg = variant === 'desktop-failed'
    ? { actionLabel: 'Starting bot capture in 5…', footer: 'Starting because desktop capture failed', icon: botIcon }
    : { actionLabel: 'Starting desktop capture in 5…', footer: 'Starting because bot failed to capture', icon: desktopIcon };

  return (
    <div className="notif">
      <div className="notif__head">
        <div className="notif__apps">
          <ZoomIcon />
          <GrainIcon />
        </div>
        <div className="notif__titles">
          <p className="notif__title">Ben:Steven</p>
          <p className="notif__sub">10:00am – 10:30am</p>
        </div>
      </div>
      <div className="notif__action">
        <span className="notif__action-icon" aria-hidden="true">{cfg.icon}</span>
        <span className="notif__action-label">{cfg.actionLabel}</span>
        <button type="button" className="notif__cancel" aria-label="Cancel"><span /></button>
      </div>
      <p className="notif__footer">{cfg.footer}</p>
    </div>
  );
}

export function FallbackNotificationArtboard() {
  return (
    <section className="artboard">
      <div className="artboard__label">Fallback notification</div>
      <div className="artboard__frame">
        <div className="artboard__row">
          <div className="artboard__variant">
            <p className="artboard__caption">When the Grain Bot fails → desktop takes over</p>
            <div className="artboard__stage"><FallbackNotification variant="bot-failed" /></div>
          </div>
          <div className="artboard__variant">
            <p className="artboard__caption">When desktop capture fails → bot takes over</p>
            <div className="artboard__stage"><FallbackNotification variant="desktop-failed" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
