// OnboardingScreens.tsx — presentational screens for the first-run flow.
// Ported from onboarding/OnboardingScreens.jsx; lucide <i data-lucide> icons
// swapped for our Icon component.
import { useState } from 'react';
import { Icon } from '../primitives/Icon';
import grainLogo from '../../assets/grain-logo.png';
import claudeIcon from '../../assets/claude-icon.png';

function ObBrand({ sm }: { sm?: boolean }) {
  return (
    <span className={`ob-brand ${sm ? 'ob-brand--sm' : ''}`}>
      <img className="ob-brand__mark" src={grainLogo} alt="" />
      <span className="ob-brand__word">Grain</span>
    </span>
  );
}

// 1 — Welcome / auth
export function ObWelcome({ onContinue }: { onContinue: () => void }) {
  const stop = (e: React.MouseEvent) => e.preventDefault();
  return (
    <div className="ob-stage ob-stage--welcome">
      <div className="ob-scroll">
        <div className="ob-auth">
          <img className="ob-auth__mark" src={grainLogo} alt="Grain" />
          <h1 className="ob-auth__title">Welcome to Grain</h1>
          <p className="ob-auth__sub">Capture, transcribe, &amp; share the best parts of your customer meetings.</p>
          <div className="ob-auth__btns">
            <button className="ob-oauth" onClick={onContinue}>
              <span style={{ color: '#4285F4', fontWeight: 700, fontSize: 17, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>G</span>
              Continue with Google
            </button>
            <button className="ob-oauth" onClick={onContinue}>
              <span className="ob-ms"><i /><i /><i /><i /></span>
              Continue with Microsoft
            </button>
            <button className="ob-oauth ob-oauth--ghost" onClick={onContinue}>
              Other options <Icon name="chevDown" />
            </button>
          </div>
          <p className="ob-auth__legal">By signing up, I agree to the <a href="#" onClick={stop}>Terms of Service</a> and <a href="#" onClick={stop}>Privacy Policy</a></p>
        </div>
        <div className="ob-foot-note">
          <Icon name="lock" size={14} /> Grain is SOC II audited and GDPR compliant. <a href="#" onClick={stop}>View privacy policy</a>
        </div>
      </div>
    </div>
  );
}

// 2 — Survey
const OB_SIZES = ['Only me', '2-24', '25-100', '101-250', '250+'];
export function ObSurvey({ onNext }: { onNext: () => void }) {
  const [size, setSize] = useState('2-24');
  const Select = ({ value, placeholder }: { value?: string; placeholder?: string }) => (
    <div className={`ob-select ${value ? '' : 'is-placeholder'}`}>
      <span>{value || placeholder}</span>
      <Icon name="chevDown" size={16} />
    </div>
  );
  return (
    <div className="ob-stage ob-stage--neutral">
      <div className="ob-scroll">
        <div className="ob-panel">
          <div className="ob-panel__brand"><ObBrand /></div>
          <h1 className="ob-panel__title">Help us personalize Grain for you</h1>
          <p className="ob-panel__sub">A few quick questions to optimize your experience</p>

          <div className="ob-form">
            <div>
              <label className="ob-q__label">Which languages do you speak in meetings?<span className="ob-q__req">*</span></label>
              <Select value="English" />
            </div>
            <div>
              <label className="ob-q__label">What kind of work do you do?<span className="ob-q__req">*</span></label>
              <Select value="Sales, Account Executive" />
            </div>
            <div>
              <label className="ob-q__label">What's your primary CRM?<span className="ob-q__req">*</span></label>
              <Select value="HubSpot" />
            </div>
            <div>
              <label className="ob-q__label">What's the size of your company?<span className="ob-q__req">*</span></label>
              <div className="ob-chips">
                {OB_SIZES.map((s) => (
                  <button key={s} className={`ob-chip ${size === s ? 'is-on' : ''}`} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="ob-form__foot">
            <button className="ob-btn" onClick={onNext}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3 — Permissions
export function ObPermissions({ onNext }: { onNext: () => void }) {
  const perms = [
    { icon: 'mic', title: 'Microphone access', sub: 'Transcribe your audio in meetings.' },
    { icon: 'volume2', title: 'Audio access', sub: "Transcribe others' audio in meetings." },
    { icon: 'accessibility', title: 'Accessibility access', sub: 'Include speaker names in transcripts.' },
  ];
  return (
    <div className="ob-stage ob-stage--neutral">
      <div className="ob-scroll">
        <div className="ob-panel">
          <div className="ob-panel__brand"><ObBrand /></div>
          <h1 className="ob-panel__title">Allow Grain to capture your meetings</h1>
          <p className="ob-panel__sub">Grain records your meetings from your desktop. If that ever fails, a backup bot joins automatically.</p>
          <div className="ob-rows">
            {perms.map((p) => (
              <div className="ob-row" key={p.title}>
                <span className="ob-row__icon ob-row__icon--dark"><Icon name={p.icon} /></span>
                <div className="ob-row__text">
                  <div className="ob-row__title">{p.title}</div>
                  <div className="ob-row__sub">{p.sub}</div>
                </div>
                <span className="ob-done"><Icon name="check" size={14} /> Done</span>
              </div>
            ))}
          </div>
          <div className="ob-form__foot"><button className="ob-btn" onClick={onNext}>Continue</button></div>
        </div>
      </div>
    </div>
  );
}

// 4 — Auto-capture
export function ObAutoCapture({ onNext }: { onNext: () => void }) {
  const [on, setOn] = useState({ external: true, internal: true, unscheduled: true } as Record<string, boolean>);
  const rows = [
    { id: 'external', icon: 'calendar', title: 'External meetings', sub: 'All meetings with external participants.' },
    { id: 'internal', icon: 'calendarDays', title: 'Internal meetings', sub: 'All meetings with only internal participants.' },
    { id: 'unscheduled', icon: 'messageSquare', title: 'Unscheduled meetings', sub: 'All ad-hoc meetings Grain detects.' },
  ];
  return (
    <div className="ob-stage ob-stage--neutral">
      <div className="ob-scroll">
        <div className="ob-panel">
          <div className="ob-panel__brand"><ObBrand /></div>
          <h1 className="ob-panel__title">Which meetings should Grain auto-capture?</h1>
          <p className="ob-panel__sub">Never miss a meeting. Grain automatically detects and starts capturing when you join.</p>
          <div className="ob-rows">
            {rows.map((r) => (
              <div className="ob-row" key={r.id}>
                <span className="ob-row__icon ob-row__icon--green"><Icon name={r.icon} /></span>
                <div className="ob-row__text">
                  <div className="ob-row__title">{r.title}</div>
                  <div className="ob-row__sub">{r.sub}</div>
                </div>
                <button className={`ob-toggle ${on[r.id] ? 'is-on' : ''}`} aria-pressed={on[r.id]}
                        onClick={() => setOn((p) => ({ ...p, [r.id]: !p[r.id] }))}><i /></button>
              </div>
            ))}
          </div>
          <div className="ob-form__foot"><button className="ob-btn" onClick={onNext}>Continue</button></div>
        </div>
      </div>
    </div>
  );
}

// 4b — Claude / MCP connector (optional, skippable)
export function ObClaude({ onConnected, onSkip }: { onConnected: () => void; onSkip: () => void }) {
  const bullets = [
    { icon: 'sparkles', text: 'Ask Claude what customers said across meetings' },
    { icon: 'fileText', text: 'Draft follow-ups, briefs, and reports from real conversations' },
    { icon: 'workflow', text: 'Keep meeting context in one place for your AI workflows' },
  ];
  return (
    <div className="ob-stage ob-stage--neutral">
      <div className="ob-scroll">
        <div className="ob-panel">
          <div className="ob-panel__brand"><ObBrand /></div>
          <div className="ob-connect" aria-hidden="true">
            <img className="ob-connect__node" src={grainLogo} alt="" />
            <span className="ob-connect__link"><Icon name="arrowRight" size={18} /></span>
            <span className="ob-connect__node ob-connect__node--claude"><img src={claudeIcon} alt="Claude" /></span>
          </div>
          <h1 className="ob-panel__title">Use your Grain meetings in Claude</h1>
          <p className="ob-panel__sub">Grain keeps the record of what was said. Connect Claude to ask questions, draft follow-ups, and build workflows from real meeting context, without copying transcripts.</p>
          <div className="ob-rows ob-rows--bullets">
            {bullets.map((b) => (
              <div className="ob-row ob-row--bullet" key={b.text}>
                <span className="ob-row__icon ob-row__icon--green"><Icon name={b.icon} /></span>
                <div className="ob-row__text"><div className="ob-row__title">{b.text}</div></div>
              </div>
            ))}
          </div>
          <div className="ob-form__foot"><button className="ob-btn" onClick={onConnected}>Connect in Claude</button></div>
          <button className="ob-link-btn" onClick={onSkip} style={{ marginTop: 4 }}>Skip for now</button>
        </div>
      </div>
    </div>
  );
}

// 5 — Personal vs team
export function ObUseSelect({ onSelect }: { onSelect: (c: 'personal' | 'team') => void }) {
  return (
    <div className="ob-stage ob-stage--neutral">
      <div className="ob-scroll">
        <div className="ob-panel__brand" style={{ marginBottom: 34 }}><ObBrand /></div>
        <h1 className="ob-panel__title" style={{ marginBottom: 40 }}>How are you planning to use Grain?</h1>
        <div className="ob-use">
          <button className="ob-use__card" onClick={() => onSelect('personal')}>
            <span className="ob-use__art"><Icon name="thumbsUp" size={60} stroke={1.4} /></span>
            <span className="ob-use__title">For personal use</span>
            <span className="ob-use__desc">For individuals who want to capture and organize their own meetings.</span>
          </button>
          <button className="ob-use__card" onClick={() => onSelect('team')}>
            <span className="ob-use__art"><Icon name="handshake" size={60} stroke={1.4} /></span>
            <span className="ob-use__title">With my team</span>
            <span className="ob-use__desc">For teams who want to share meeting context and collaborate at scale.</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 6 — Trial (bento)
export function ObTrial({ onStart, onSelf }: { onStart: () => void; onSelf: () => void }) {
  return (
    <div className="ob-stage ob-stage--neutral">
      <div className="ob-scroll">
        <div className="ob-trial">
          <div className="ob-panel__brand"><ObBrand /></div>
          <h1 className="ob-panel__title">Business plan is free for 14 days</h1>
          <p className="ob-trial__h2">Power your organization's AI work with team meeting intelligence.</p>

          <div className="ob-bento">
            <div className="ob-cell ob-cell--wide ob-cell--hero">
              <div className="ob-cell__title">Organization workspace</div>
              <div className="ob-cell__desc">Make AI smarter with the full context of your team meetings.</div>
              <div className="ob-cell__tag">Shared context</div>
            </div>
            <div className="ob-cell ob-cell--mini">
              <div className="ob-cell__title"><Icon name="infinity" size={16} /> No meeting length cap</div>
            </div>
            <div className="ob-cell ob-cell--mini">
              <div className="ob-cell__title"><Icon name="history" size={16} /> Unlimited history</div>
            </div>
            <div className="ob-cell ob-cell--mini">
              <div className="ob-cell__title"><Icon name="terminal" size={16} /> Advanced MCP</div>
            </div>
            <div className="ob-cell ob-cell--wide">
              <div className="ob-cell__title">Workspace integrations &amp; API</div>
              <div className="ob-cell__desc">Integrate your meetings data with AI agents, CRMs, Slack, and more.</div>
              <div className="ob-cell__tag">HubSpot · Salesforce · Slack · API</div>
            </div>
          </div>

          <div className="ob-trial__cta">
            <button className="ob-btn" onClick={onStart}>Start trial</button>
          </div>
          <button className="ob-link-btn ob-trial__self" onClick={onSelf}>Use Grain by myself</button>
        </div>
      </div>
    </div>
  );
}
