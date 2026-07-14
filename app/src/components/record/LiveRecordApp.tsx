// LiveRecordApp.tsx — the LIVE meeting-recording surface (web + desktop-app
// chrome). A free user recording past the 45-minute cap is notified here:
// both web and desktop show an inline cut-off notice below the transcript
// (centered on web); desktop additionally carries the notice in the green bar.
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../shell/Sidebar';
import { Icon } from '../primitives/Icon';
import { TweaksPanel, TweakSection, TweakButton, TweakRadio, useTweaks } from '../tweaks/TweaksPanel';
import { USER } from '../../data/meetings';

const TRANSCRIPT = [
  { who: 'Alex Volta', text: 'Okay, let’s kick off the Q2 strategy review — thanks everyone for jumping on.' },
  { who: 'Jeff Whitlock', text: 'Sounds good. I pulled the pricing model changes into the deck so we can walk through the share modal and the invite flow.' },
  { who: 'Alex Volta', text: 'Perfect. Let’s start with how view-only sharing stays free, then get into the trial hook.' },
];

// The transcript-cutoff CTA shown inline when a free recording hits the cap.
export function CutoffNotice({ onStartTrial }: { onStartTrial?: () => void }) {
  return (
    <div className="lr-cutoff">
      <div className="lr-cutoff__title">Recording stopped at the 45-minute free limit</div>
      <p className="lr-cutoff__desc">Your meeting so far is saved. Start a trial to keep recording and transcribing full-length.</p>
      <button className="btn-v2 btn-v2--dark btn-v2--lg" onClick={onStartTrial}><Icon name="users" size={15} /> Start free trial</button>
      <div className="lr-cutoff__note">Grain Business · free for 14 days</div>
    </div>
  );
}

function LiveSurface({ capped, onStartTrial }: { capped: boolean; onStartTrial?: () => void }) {
  return (
    <div className="lr-surface">
      <main className="lr-main">
        <h1 className="lr-title" contentEditable suppressContentEditableWarning>Q2 Strategy</h1>
        <div className="lr-chips">
          <span className="lr-chip"><Icon name="calendar" size={14} /> Jul 14th</span>
          <span className="lr-chip"><Icon name="lock" size={14} /> No team access</span>
        </div>
        <div className="lr-tabs">
          <span className="lr-tab is-active">Live Transcript</span>
          <span className="lr-tab">Private notes</span>
        </div>
        <label className="lr-search"><Icon name="search" size={15} /><input placeholder="Search transcript" /></label>
        <div className="lr-transcript">
          {TRANSCRIPT.map((t, i) => (
            <div key={i} className="lr-line">
              <div className="lr-line__who"><span className="lr-line__av">{t.who[0]}</span> {t.who}</div>
              <p className="lr-line__text">{t.text}</p>
            </div>
          ))}
          {capped && <CutoffNotice onStartTrial={onStartTrial} />}
        </div>
      </main>
    </div>
  );
}

type LrTweaks = { state: 'recording' | 'capped'; chrome: 'web' | 'desktop' };
type LrSet = <K extends keyof LrTweaks>(k: K | Partial<LrTweaks>, v?: LrTweaks[K]) => void;

export function LiveRecordApp() {
  const navigate = useNavigate();
  const [t, setT] = useTweaks<LrTweaks>({ state: 'capped', chrome: 'web' });
  const capped = t.state === 'capped';
  const goStartTrial = () => navigate('/?app=1');

  // ── Desktop app chrome ──────────────────────────────────────────────────
  if (t.chrome === 'desktop') {
    return (
      <>
        <div className="lr-desktop">
          <div className={`lr-capbar lr-capbar--desktop${capped ? ' is-capped' : ''}`}>
            <div className="mac-traffic"><span /><span /><span /></div>
            <button className="lr-capbar__back" aria-label="Back"><Icon name="chevLeft" size={16} /></button>
            {capped ? (
              <span className="lr-capbar__notice">
                <Icon name="alert" size={14} /> 45-minute free recording limit reached
                <button className="lr-capbar__cta" onClick={goStartTrial}>Start trial</button>
              </span>
            ) : (
              <span className="lr-capbar__title"><Icon name="audioLines" size={13} /> Capturing: Q2 Strategy</span>
            )}
            <button className="lr-capbar__stop" aria-label="Stop capturing"><span className="lr-capbar__stopsq" /></button>
          </div>
          <LiveSurface capped={capped} onStartTrial={goStartTrial} />
        </div>
        <LiveTweaks t={t} setT={setT} />
      </>
    );
  }

  // ── Web app chrome ──────────────────────────────────────────────────────
  return (
    <>
      <div className="lr-web">
        <div className={`lr-capbar${capped ? ' is-capped' : ''}`}>
          {capped ? (
            <span className="lr-capbar__notice">
              <Icon name="alert" size={14} /> 45-minute free recording limit reached
              <button className="lr-capbar__cta" onClick={goStartTrial}>Start trial</button>
            </span>
          ) : (
            <span className="lr-capbar__title"><Icon name="video" size={15} /> Capturing: Feedback on New Model Designs</span>
          )}
          <span className="lr-capbar__actions">
            {!capped && <button className="lr-capbar__meet"><Icon name="video" size={13} /> Open Meet</button>}
            <button className="lr-capbar__stopbtn"><span className="lr-capbar__stopsq" /> Stop capturing</button>
          </span>
        </div>
        <div className="lr-body">
          <Sidebar user={USER} orgName="Grain" onSettings={() => navigate('/settings')} onIntegrations={() => navigate('/integrations')} />
          <LiveSurface capped={capped} onStartTrial={goStartTrial} />
        </div>
      </div>
      <LiveTweaks t={t} setT={setT} />
    </>
  );
}

function LiveTweaks({ t, setT }: { t: LrTweaks; setT: LrSet }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Review">
        <TweakButton label="▶ Hook gallery" onClick={() => { window.location.href = '/hook-gallery'; }} />
      </TweakSection>
      <TweakSection label="State">
        <TweakRadio label="Recording" value={t.state} onChange={(v) => setT('state', v)}
          options={[{ value: 'recording', label: 'Recording' }, { value: 'capped', label: '45-min cap' }]} />
        <TweakRadio label="Chrome" value={t.chrome} onChange={(v) => setT('chrome', v)}
          options={[{ value: 'web', label: 'Web app' }, { value: 'desktop', label: 'Desktop app' }]} />
      </TweakSection>
    </TweaksPanel>
  );
}
