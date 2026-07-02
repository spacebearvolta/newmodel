// MyMeetingsNew.tsx — Reorganized "My Meetings" settings page (Capture vs Access)
import { useState } from 'react';
import { Icon } from '../primitives/Icon';
import { RadioCard, Select, ToggleSwitch } from './Primitives';
import type { SelectOption } from './Primitives';
import { FallbackNotificationArtboard } from './FallbackNotification';

interface State {
  desktopParticipantAccess: string;
  desktopNonSensAccess: string;
  botParticipantAccess: string;
  botNonSensAccess: string;
  preferredMethod: 'bot' | 'desktop' | 'customize';
  methodExternal: string;
  methodInternal: string;
  methodUnscheduled: string;
  autoOrganizerOnly: boolean;
  fallback: boolean;
  linkAccess: string;
}

const CAPTURE_METHOD_OPTIONS: SelectOption[] = [
  { value: 'bot', label: 'Bot capture' },
  { value: 'desktop', label: 'Desktop capture' },
  { value: 'none', label: "Don't capture" },
];

export function MyMeetingsNew({ onTrial = false, simpleShare = true }: { onTrial?: boolean; simpleShare?: boolean }) {
  const [s, setS] = useState<State>({
    desktopParticipantAccess: 'none',
    desktopNonSensAccess: 'workspace',
    botParticipantAccess: 'all-participants',
    botNonSensAccess: 'workspace',
    preferredMethod: 'bot',
    methodExternal: 'bot',
    methodInternal: 'desktop',
    methodUnscheduled: 'desktop',
    autoOrganizerOnly: true,
    fallback: true,
    linkAccess: 'anyone',
  });
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => {
    const next = { ...p, [k]: v };
    if (
      next.preferredMethod === 'customize' &&
      (k === 'methodExternal' || k === 'methodInternal' || k === 'methodUnscheduled')
    ) {
      const all = [next.methodExternal, next.methodInternal, next.methodUnscheduled];
      if (all.every((m) => m === 'bot')) next.preferredMethod = 'bot';
      else if (all.every((m) => m === 'desktop')) next.preferredMethod = 'desktop';
    }
    return next;
  });

  const goStartTrial = () => { window.location.href = '/'; };

  return (
    <div className="set-page">
      <header className="set-page__head">
        <h1 className="set-page__title">My Meetings</h1>
        <p className="set-page__sub">Customize how your meetings get captured, shared, and summarized.</p>
      </header>

      {/* Section 1: Capture settings */}
      <section className="set-section">
        <div className="set-sub__head">
          <div className="set-sub__titles">
            <h2 className="set-sub__title">Capture settings</h2>
            <p className="set-sub__sub">Set how you'd like Grain to capture your meetings.</p>
          </div>
        </div>
        <div className="set-card">
          <div className="set-row set-row--divider">
            <div className="set-row__label">Preferred capture method</div>
            <div className="set-row__sub">How you'd like Grain to capture all your meetings.</div>
            <div className="radio-card-group" role="radiogroup" aria-label="Preferred capture method">
              <RadioCard
                icon="audioLines"
                title="Desktop capture"
                description="The Grain desktop app will capture the meeting transcript (no video)."
                checked={s.preferredMethod === 'desktop'}
                onChange={() => set('preferredMethod', 'desktop')}
              />
              <RadioCard
                icon="video"
                title="Bot capture"
                description="The Grain notetaker bot will join your calls and record the meeting."
                checked={s.preferredMethod === 'bot'}
                onChange={() => set('preferredMethod', 'bot')}
              />
              <RadioCard
                icon="slidersH"
                title="Customize"
                description="Select which capture method works best for which meeting type."
                checked={s.preferredMethod === 'customize'}
                onChange={() => set('preferredMethod', 'customize')}
              />
            </div>

            {s.preferredMethod === 'customize' && (
              <div className="capture-matrix" role="group" aria-label="Capture method per meeting type">
                <div className="capture-matrix__row">
                  <div className="capture-matrix__text">
                    <p className="capture-matrix__title">External meetings</p>
                    <p className="capture-matrix__sub">Meetings with people outside your workspace.</p>
                  </div>
                  <Select width={200} value={s.methodExternal} onChange={(v) => set('methodExternal', String(v))} options={CAPTURE_METHOD_OPTIONS} />
                </div>
                <div className="capture-matrix__row">
                  <div className="capture-matrix__text">
                    <p className="capture-matrix__title">Internal meetings</p>
                    <p className="capture-matrix__sub">Meetings with only your workspace members.</p>
                  </div>
                  <Select width={200} value={s.methodInternal} onChange={(v) => set('methodInternal', String(v))} options={CAPTURE_METHOD_OPTIONS} />
                </div>
                <div className="capture-matrix__row">
                  <div className="capture-matrix__text">
                    <p className="capture-matrix__title">Unscheduled meetings</p>
                    <p className="capture-matrix__sub">Ad-hoc meetings not on your calendar.</p>
                  </div>
                  <Select width={200} value={s.methodUnscheduled} onChange={(v) => set('methodUnscheduled', String(v))} options={CAPTURE_METHOD_OPTIONS} />
                </div>
              </div>
            )}
          </div>

          <div className="set-row set-row--continuation set-row--divider">
            <div className="set-inline">
              <div className="set-inline__text">
                <p className="set-inline__title">Bot display settings</p>
                <p className="set-inline__desc">Customize how the Grain Bot appears and behaves in meetings.</p>
              </div>
              <button type="button" className="set-customize">Edit</button>
            </div>
          </div>

          <div className="set-row set-row--continuation">
            <div className="set-inline">
              <div className="set-inline__text">
                <p className="set-inline__title">Only auto-capture if I am the event organizer</p>
                <p className="set-inline__desc">When on, the Grain Bot will only auto-join meetings where you're the organizer.</p>
              </div>
              <ToggleSwitch checked={s.autoOrganizerOnly} onChange={(v) => set('autoOrganizerOnly', v)} />
            </div>
          </div>

          <div className="set-row set-row--continuation">
            <div className="set-inline">
              <div className="set-inline__text">
                <p className="set-inline__title">Use fallback capture</p>
                <p className="set-inline__desc">If your preferred capture method fails, automatically try the other one.</p>
              </div>
              <ToggleSwitch checked={s.fallback} onChange={(v) => set('fallback', v)} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Access settings */}
      <section className="set-section">
        <div className="set-sub__head">
          <div className="set-sub__titles">
            <h2 className="set-sub__title">Access settings</h2>
            <p className="set-sub__sub">Control who can access your meeting captures.</p>
          </div>
        </div>

        {simpleShare ? (
          <div className="set-card">
            <div className="set-statement">
              <span className="set-statement__icon"><Icon name="users" size={17} /></span>
              <p className="set-statement__text">
                Participants have access to your <strong>bot captured</strong> meetings. Desktop captured meetings are only shared <strong>manually</strong>.
              </p>
            </div>
            {!onTrial && (
              <div className="set-upsell set-upsell--bordered">
                <div className="set-upsell__copy">
                  <p className="set-upsell__title">Non-participant sharing</p>
                  <p className="set-upsell__text">Automatically give teammates access to meetings they didn't attend.</p>
                </div>
                <button type="button" className="set-upsell__cta" onClick={goStartTrial}>Start trial</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <CaptureAccessSection
              title="Desktop capture access"
              sub="Who gets access to meetings captured by the Grain desktop app."
              onTrial={onTrial}
              participantValue={s.desktopParticipantAccess}
              onParticipant={(v) => set('desktopParticipantAccess', v)}
              nonSensValue={s.desktopNonSensAccess}
              onNonSens={(v) => set('desktopNonSensAccess', v)}
              onStartTrial={goStartTrial}
            />
            <CaptureAccessSection
              title="Bot capture access"
              sub="Who gets access to meetings captured by the Grain notetaker bot."
              onTrial={onTrial}
              participantValue={s.botParticipantAccess}
              onParticipant={(v) => set('botParticipantAccess', v)}
              nonSensValue={s.botNonSensAccess}
              onNonSens={(v) => set('botNonSensAccess', v)}
              onStartTrial={goStartTrial}
            />
          </>
        )}

        <div className="set-card" style={{ marginTop: 24 }}>
          <div className="set-row">
            <div className="set-inline">
              <div className="set-inline__text">
                <p className="set-inline__title">Link access default</p>
                <p className="set-inline__desc">Who can access your meeting recordings with a shared link?</p>
              </div>
              <Select
                width={220}
                value={s.linkAccess}
                onChange={(v) => set('linkAccess', String(v))}
                options={[
                  { value: 'anyone', label: 'Anyone with link' },
                  onTrial
                    ? { value: 'workspace', label: 'Anyone in Acme' }
                    : { value: 'workspace', label: 'Anyone in Acme', disabled: true, accessory: <button type="button" className="set-mini-cta" onClick={goStartTrial}>Start trial</button> },
                  { value: 'invited', label: 'People with access' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <FallbackNotificationArtboard />
    </div>
  );
}

function CaptureAccessSection({ title, sub, onTrial, participantValue, onParticipant, nonSensValue, onNonSens, onStartTrial }: {
  title: string; sub: string; onTrial?: boolean;
  participantValue: string; onParticipant: (v: string) => void;
  nonSensValue: string; onNonSens: (v: string) => void;
  onStartTrial: () => void;
}) {
  const participantOptions: SelectOption[] = [
    { value: 'all-participants', label: 'All meeting participants' },
    { value: 'acme-only', label: 'Only Acme participants' },
    onTrial
      ? { value: 'org-only', label: 'Only organization participants' }
      : { value: 'org-only', label: 'Only organization participants', disabled: true, accessory: <button type="button" className="set-mini-cta" onClick={onStartTrial}>Start trial</button> },
    { value: 'none', label: 'None' },
  ];
  const nonSensOptions: SelectOption[] = [
    { value: 'workspace', label: 'All workspace members' },
    { value: 'participants', label: 'None' },
  ];
  return (
    <div className="set-card">
      <div className="set-row set-row--divider">
        <div className="set-row__label">{title}</div>
        <div className="set-row__sub">{sub}</div>
      </div>

      <div className="set-row set-row--continuation">
        <div className="set-inline">
          <div className="set-inline__text">
            <p className="set-inline__title">Default access for participants</p>
            <p className="set-inline__desc">Choose which meeting participants automatically get access to meetings you record.</p>
          </div>
          <Select width={240} value={participantValue} onChange={(v) => onParticipant(String(v))} options={participantOptions} />
        </div>
      </div>

      {onTrial ? (
        <>
          <div className="set-row set-row--continuation">
            <p className="set-inline__title">Default access for nonparticipants</p>
            <p className="set-inline__desc" style={{ marginTop: 2 }}>Choose which workspace members get access to meetings they did not attend.</p>
          </div>
          <div className="set-row set-row--continuation">
            <div className="oa-sens-row">
              <div className="oa-sens-main">
                <span className="sens-tag sens-tag--low"><span className="sens-tag__dot" aria-hidden="true" />Not sensitive</span>
                <p className="set-inline__desc oa-sens-desc">Meetings that do not contain any information that would be sensitive to a broad organization-wide audience.</p>
              </div>
              <Select width={240} value={nonSensValue} onChange={(v) => onNonSens(String(v))} options={nonSensOptions} />
            </div>
          </div>
          <div className="set-row set-row--continuation">
            <div className="oa-sens-row">
              <span className="sens-tag sens-tag--high"><span className="sens-tag__dot" aria-hidden="true" />Sensitive</span>
            </div>
            <p className="set-inline__desc oa-sens-desc"><strong style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Only participants</strong> — Sensitive meetings are not automatically shared with nonparticipants.</p>
          </div>
        </>
      ) : (
        <div className="set-row set-row--continuation">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Default access for nonparticipants</p>
              <p className="set-inline__desc">Choose which workspace members get access to meetings they did not attend.</p>
            </div>
            <button type="button" className="set-upsell__cta" onClick={onStartTrial}>Start trial</button>
          </div>
        </div>
      )}
    </div>
  );
}
