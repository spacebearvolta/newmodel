// OnboardingScreens.jsx — presentational screens for the first-run flow.
// Pure UI; the driver in Onboarding.html owns routing + branching.
// Icons use lucide <i data-lucide> (Onboarding.html calls createIcons each render).

const { useState: useOB } = React;

const GRAIN_LOGO = 'assets/grain-logo.png';

function ObBrand({ sm }) {
  return (
    <span className={`ob-brand ${sm ? 'ob-brand--sm' : ''}`}>
      <img className="ob-brand__mark" src={GRAIN_LOGO} alt="" />
      <span className="ob-brand__word">Grain</span>
    </span>
  );
}

/* 1 ── Welcome / auth ─────────────────────────────────────────── */
function ObWelcome({ onContinue }) {
  const stop = (e) => e.preventDefault();
  return (
    <div className="ob-stage ob-stage--welcome">
      <div className="ob-scroll">
        <div className="ob-auth">
          <img className="ob-auth__mark" src={GRAIN_LOGO} alt="Grain" />
          <h1 className="ob-auth__title">Welcome to Grain</h1>
          <p className="ob-auth__sub">Capture, transcribe, &amp; share the best parts of your customer meetings.</p>
          <div className="ob-auth__btns">
            <button className="ob-oauth" onClick={onContinue}>
              <span className="ob-oauth__g" style={{ color: '#4285F4', fontWeight: 700, fontSize: 17, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>G</span>
              Continue with Google
            </button>
            <button className="ob-oauth" onClick={onContinue}>
              <span className="ob-ms"><i /><i /><i /><i /></span>
              Continue with Microsoft
            </button>
            <button className="ob-oauth ob-oauth--ghost" onClick={onContinue}>
              Other options <i data-lucide="chevron-down" />
            </button>
          </div>
          <p className="ob-auth__legal">By signing up, I agree to the <a href="#" onClick={stop}>Terms of Service</a> and <a href="#" onClick={stop}>Privacy Policy</a></p>
        </div>
        <div className="ob-foot-note">
          <i data-lucide="lock" /> Grain is SOC II audited and GDPR compliant. <a href="#" onClick={stop}>View privacy policy</a>
        </div>
      </div>
    </div>
  );
}

/* 2 ── Survey ─────────────────────────────────────────────────── */
const OB_SIZES = ['Only me', '2-24', '25-100', '101-250', '250+'];
function ObSurvey({ onNext }) {
  const [size, setSize] = useOB('2-24');
  const Select = ({ value, placeholder }) => (
    <div className={`ob-select ${value ? '' : 'is-placeholder'}`}>
      <span>{value || placeholder}</span>
      <i data-lucide="chevron-down" />
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
              <Select value="Sales — Account Executive" />
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

/* 3 ── Permissions ────────────────────────────────────────────── */
function ObPermissions({ onNext }) {
  const perms = [
    { icon: 'mic', title: 'Microphone access', sub: 'Transcribe your audio in meetings.' },
    { icon: 'volume-2', title: 'Audio access', sub: "Transcribe others' audio in meetings." },
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
                <span className="ob-row__icon ob-row__icon--dark"><i data-lucide={p.icon} /></span>
                <div className="ob-row__text">
                  <div className="ob-row__title">{p.title}</div>
                  <div className="ob-row__sub">{p.sub}</div>
                </div>
                <span className="ob-done"><i data-lucide="check" /> Done</span>
              </div>
            ))}
          </div>
          <div className="ob-form__foot"><button className="ob-btn" onClick={onNext}>Continue</button></div>
        </div>
      </div>
    </div>
  );
}

/* 4 ── Auto-capture ───────────────────────────────────────────── */
function ObAutoCapture({ onNext }) {
  const [on, setOn] = useOB({ external: true, internal: true, unscheduled: true });
  const rows = [
    { id: 'external', icon: 'calendar', title: 'External meetings', sub: 'All meetings with external participants.' },
    { id: 'internal', icon: 'calendar-days', title: 'Internal meetings', sub: 'All meetings with only internal participants.' },
    { id: 'unscheduled', icon: 'message-square', title: 'Unscheduled meetings', sub: 'All ad-hoc meetings Grain detects.' },
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
                <span className="ob-row__icon ob-row__icon--green"><i data-lucide={r.icon} /></span>
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

/* 4b ── Claude / MCP connector (optional, skippable) ──────────────
   Sits between auto-capture and the personal/team choice. Connecting can't
   complete inside Grain — "Connect in Claude" hands off to Claude in the
   browser — so in the prototype both Connect and Skip just advance setup. */
function ObClaude({ onConnected, onSkip }) {
  const bullets = [
    { icon: 'sparkles', text: 'Ask Claude what customers said across meetings' },
    { icon: 'file-text', text: 'Draft follow-ups, briefs, and reports from real conversations' },
    { icon: 'workflow', text: 'Keep meeting context in one place for your AI workflows' },
  ];
  return (
    <div className="ob-stage ob-stage--neutral">
      <div className="ob-scroll">
        <div className="ob-panel">
          <div className="ob-panel__brand"><ObBrand /></div>
          <div className="ob-connect" aria-hidden="true">
            <img className="ob-connect__node" src={GRAIN_LOGO} alt="" />
            <span className="ob-connect__link"><i data-lucide="arrow-right" /></span>
            <span className="ob-connect__node ob-connect__node--claude"><img src="assets/claude-icon.png" alt="Claude" /></span>
          </div>
          <h1 className="ob-panel__title">Use your Grain meetings in Claude</h1>
          <p className="ob-panel__sub">Grain keeps the record of what was said. Connect Claude to ask questions, draft follow-ups, and build workflows from real meeting context — without copying transcripts.</p>
          <div className="ob-rows ob-rows--bullets">
            {bullets.map((b) => (
              <div className="ob-row ob-row--bullet" key={b.text}>
                <span className="ob-row__icon ob-row__icon--green"><i data-lucide={b.icon} /></span>
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

/* 5 ── Personal vs team ───────────────────────────────────────── */
function ObUseSelect({ onSelect }) {
  return (
    <div className="ob-stage ob-stage--neutral">
      <div className="ob-scroll">
        <div className="ob-panel__brand" style={{ marginBottom: 34 }}><ObBrand /></div>
        <h1 className="ob-panel__title" style={{ marginBottom: 40 }}>How are you planning to use Grain?</h1>
        <div className="ob-use">
          <button className="ob-use__card" onClick={() => onSelect('personal')}>
            <span className="ob-use__art"><i data-lucide="thumbs-up" /></span>
            <span className="ob-use__title">For personal use</span>
            <span className="ob-use__desc">For individuals who want to capture and organize their own meetings.</span>
          </button>
          <button className="ob-use__card" onClick={() => onSelect('team')}>
            <span className="ob-use__art"><i data-lucide="handshake" /></span>
            <span className="ob-use__title">With my team</span>
            <span className="ob-use__desc">For teams who want to share meeting context and collaborate at scale.</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* 6 ── Trial (bento) ──────────────────────────────────────────── */
function ObTrial({ onStart, onSelf }) {
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
              <div className="ob-cell__title"><i data-lucide="infinity" /> No meeting length cap</div>
            </div>
            <div className="ob-cell ob-cell--mini">
              <div className="ob-cell__title"><i data-lucide="history" /> Unlimited history</div>
            </div>
            <div className="ob-cell ob-cell--mini">
              <div className="ob-cell__title"><i data-lucide="terminal" /> Advanced MCP</div>
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

Object.assign(window, { ObWelcome, ObSurvey, ObPermissions, ObAutoCapture, ObClaude, ObUseSelect, ObTrial, ObBrand });
