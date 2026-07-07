// RecordApp.tsx — a lightweight recording/player surface (deck #10–#12) so the
// media-player touchpoints have a real in-context home: the media-lock overlay
// (E, deck #10/#11), the inline locked-recording card (#12), and the locked
// action-menu badges (D, deck #9/#10). Driven by its own Tweaks panel and by
// the gallery's "View in prototype" deep-links (?tw=).
import { Icon } from '../primitives/Icon';
import {
  MediaLockOverlayV2Live,
  LockedRecordingCardV2Live,
  UpgradeBadgeV2Live,
} from '../hooksV2/HooksV2Live';
import { TweaksPanel, TweakSection, TweakSelect, TweakToggle, useTweaks } from '../tweaks/TweaksPanel';

type PlayerState = 'normal' | 'limit' | 'locked' | 'locked-card';
interface Tweaks { state: PlayerState; actionsOpen: boolean; wrapInMacChrome: boolean }

const ACTION_ROWS = [
  { label: 'Copy', locked: false },
  { label: 'Download', locked: false },
  { label: 'Send to Slack', locked: false },
  { label: 'Send to HubSpot', locked: true },
  { label: 'Send to Salesforce', locked: true },
];

function RecordSurface({ t }: { t: Tweaks }) {
  const overlay = t.state === 'limit' || t.state === 'locked';
  const bodyLocked = t.state === 'locked-card';
  return (
    <div className="intg-app" style={{ display: 'block', background: 'var(--bg-app)', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--fg-4)' }}>
        <span>Meetings</span><Icon name="chevRight" size={14} />
        <span style={{ color: 'var(--fg-2)' }}>Product Coordination Meeting</span>
        <span style={{ flex: 1 }} />
        <button className="btn-v2 btn-v2--dark" style={{ padding: '6px 12px', fontSize: 13 }}><Icon name="share2" size={13} /> Share</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: 28, padding: '24px 28px', alignItems: 'start' }}>
        <div>
          <h1 style={{ font: '700 24px/1.2 var(--font-sans)', color: 'var(--fg-1)', margin: '0 0 14px' }}>Product Coordination Meeting</h1>
          <div style={{ display: 'flex', gap: 18, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            {['Summary', 'Private Notes', 'Transcript'].map((tab, i) => (
              <span key={tab} style={{ paddingBottom: 10, fontSize: 14, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? 'var(--fg-1)' : 'var(--fg-5)', borderBottom: i === 0 ? '2px solid var(--fg-1)' : '2px solid transparent' }}>{tab}</span>
            ))}
          </div>
          {bodyLocked ? (
            <div style={{ padding: '40px 0' }}><LockedRecordingCardV2Live onStartTrial={() => {}} /></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-3)', marginBottom: 4 }}>Action Items</div>
              {['Review latest results and sign off', 'Schedule a short calendar check-in', 'Finish refactor PR and push changes', 'Wrap up the MCP integration work'].map((a) => (
                <div key={a} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13.5, color: 'var(--fg-3)' }}>
                  <span style={{ width: 15, height: 15, borderRadius: 4, border: '1.5px solid var(--border-strong)', flexShrink: 0 }} /> {a}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg, #2b2f36, #1a1d22)' }}>
            {overlay && <MediaLockOverlayV2Live kind={t.state === 'locked' ? 'locked' : 'limit'} onUpgrade={() => {}} />}
          </div>
          <div style={{ position: 'relative', marginTop: 14, border: '1px solid var(--border)', borderRadius: 10, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: t.actionsOpen ? '1px solid var(--border)' : '0' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)' }}>Actions</span>
              <button className="btn-v2 btn-v2--ghost" style={{ padding: 6 }} onClick={() => {}}><Icon name="ellipsisV" size={16} /></button>
            </div>
            {t.actionsOpen && (
              <div style={{ padding: 6 }}>
                {ACTION_ROWS.map((r) => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 10px', borderRadius: 8, fontSize: 14, color: r.locked ? 'var(--fg-5)' : 'var(--fg-1)' }}>
                    <span>{r.label}</span>
                    {r.locked && <UpgradeBadgeV2Live onClick={() => {}} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecordApp() {
  const [t, setT] = useTweaks<Tweaks>({ state: 'limit', actionsOpen: true, wrapInMacChrome: true });
  const inner = <RecordSurface t={t} />;
  return (
    <>
      {t.wrapInMacChrome ? (
        <div className="mac-shell"><div className="mac-shell__window">
          <div className="mac-titlebar"><div className="mac-traffic"><span /><span /><span /></div><div className="mac-titlebar__title">Grain</div></div>
          <div className="mac-body">{inner}</div>
        </div></div>
      ) : (
        <div style={{ height: '100vh', overflow: 'auto' }}>{inner}</div>
      )}
      <TweaksPanel title="Tweaks">
        <TweakSection label="State">
          <TweakSelect
            label="Recording state"
            value={t.state}
            onChange={(v) => setT('state', v as PlayerState)}
            options={[
              { value: 'normal', label: 'Normal (unlocked)' },
              { value: 'limit', label: 'Recording limit (overlay)' },
              { value: 'locked', label: 'Locked (overlay)' },
              { value: 'locked-card', label: 'Locked (inline card)' },
            ]}
          />
          <TweakToggle label="Actions menu open" value={t.actionsOpen} onChange={(v) => setT('actionsOpen', v)} />
        </TweakSection>
        <TweakSection label="Presentation">
          <TweakToggle label="Mac chrome" value={t.wrapInMacChrome} onChange={(v) => setT('wrapInMacChrome', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
