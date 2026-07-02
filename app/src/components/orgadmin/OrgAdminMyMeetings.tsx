// OrgAdminMyMeetings.tsx — the org-admin variant of "My Meetings": renders as
// Organization admin → Meetings (orgAdmin, full page) AND embedded inside a
// Team's "Team default settings" section (orgAdmin + embed, scope="team").
import { Fragment, useState } from 'react';
import type { ElementType } from 'react';
import { Icon } from '../primitives/Icon';
import { RadioCard, Select, ToggleSwitch } from '../settings/Primitives';
import type { SelectOption } from '../settings/Primitives';
import { FallbackNotificationArtboard } from '../settings/FallbackNotification';

interface State {
  preferredMethod: 'bot' | 'desktop' | 'customize';
  methodExternal: string;
  methodInternal: string;
  methodUnscheduled: string;
  autoOrganizerOnly: boolean;
  fallback: boolean;
  participantMode: string;
  participantBot: string;
  participantDesk: string;
  nonAttendMode: string;
  nonAttendBot: string;
  nonAttendDesk: string;
  participantAccess: string;
  accessNotSensitive: string;
  linkAccess: string;
  allowCaptureOverrides: boolean;
  allowShareOverrides: boolean;
}

const CAPTURE_METHOD_OPTIONS: SelectOption[] = [
  { value: 'bot', label: 'Bot capture' },
  { value: 'desktop', label: 'Desktop capture' },
  { value: 'none', label: "Don't capture" },
];

// Capture-method card: the radio cards + bot display + organizer + fallback
// rows. Identical across My Meetings, Org admin → Meetings, and Team
// defaults (all three render this component via OrgAdminMyMeetings).
function CaptureMethodCard({ s, set }: { s: State; set: <K extends keyof State>(k: K, v: State[K]) => void }) {
  return (
    <div className="set-card">
      <div className="set-row set-row--divider">
        <div className="set-row__label">Capture method</div>
        <div className="set-row__sub">How you'd like Grain to capture all your meetings.</div>
        <div className="radio-card-group" role="radiogroup" aria-label="Capture method">
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
                <p className="capture-matrix__sub">Meetings with people outside your organization.</p>
              </div>
              <Select width={220} value={s.methodExternal} onChange={(v) => set('methodExternal', String(v))} options={CAPTURE_METHOD_OPTIONS} />
            </div>
            <div className="capture-matrix__row">
              <div className="capture-matrix__text">
                <p className="capture-matrix__title">Internal meetings</p>
                <p className="capture-matrix__sub">Meetings with only your organization members.</p>
              </div>
              <Select width={220} value={s.methodInternal} onChange={(v) => set('methodInternal', String(v))} options={CAPTURE_METHOD_OPTIONS} />
            </div>
            <div className="capture-matrix__row">
              <div className="capture-matrix__text">
                <p className="capture-matrix__title">Unscheduled meetings</p>
                <p className="capture-matrix__sub">Ad-hoc meetings not on your calendar.</p>
              </div>
              <Select width={220} value={s.methodUnscheduled} onChange={(v) => set('methodUnscheduled', String(v))} options={CAPTURE_METHOD_OPTIONS} />
            </div>
          </div>
        )}
      </div>

      {(s.preferredMethod === 'bot' || s.preferredMethod === 'desktop' || s.preferredMethod === 'customize') && (
        <div className="set-row set-row--continuation set-row--divider">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Bot display settings</p>
              <p className="set-inline__desc">Customize how the Grain Bot appears and behaves in meetings.</p>
            </div>
            <button type="button" className="set-customize">Edit</button>
          </div>
        </div>
      )}

      <div className="set-row set-row--continuation">
        <div className="set-inline">
          <div className="set-inline__text">
            <p className="set-inline__title">Only auto capture if an organization member is the event organizer</p>
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
  );
}

export function OrgAdminMyMeetings({ showArtboard = true, orgAdmin = false, embed = false, scope }: {
  showArtboard?: boolean; orgAdmin?: boolean; embed?: boolean; scope?: 'team' | 'organization';
}) {
  const scopeWord = scope === 'team' ? 'team' : 'organization';

  const [s, setS] = useState<State>({
    preferredMethod: 'bot',
    methodExternal: 'bot',
    methodInternal: 'desktop',
    methodUnscheduled: 'desktop',
    autoOrganizerOnly: false,
    fallback: true,
    participantMode: 'all-participants',
    participantBot: 'all-participants',
    participantDesk: 'all-participants',
    nonAttendMode: 'all-org',
    nonAttendBot: 'all-org',
    nonAttendDesk: 'all-org',
    participantAccess: 'all-participants',
    accessNotSensitive: 'workspace',
    linkAccess: 'anyone',
    allowCaptureOverrides: false,
    allowShareOverrides: false,
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

  // Meeting sensitivity instructions modal — persisted instructions used by
  // Grain's meeting sensitivity detection agent. Doesn't change access policy.
  const [sensInstructions, setSensInstructions] = useState(
    'Mark meetings as sensitive if they include legal, HR, compensation, or performance topics.'
  );
  const [sensModalOpen, setSensModalOpen] = useState(false);
  const [sensDraft, setSensDraft] = useState(sensInstructions);

  const openSensModal = () => { setSensDraft(sensInstructions); setSensModalOpen(true); };
  const cancelSensModal = () => setSensModalOpen(false);
  const saveSensModal = () => { setSensInstructions(sensDraft); setSensModalOpen(false); };

  const participantAccessOptions: SelectOption[] = [
    { value: 'all-participants', label: 'All meeting participants' },
    { value: 'acme-only', label: 'Only acme.com participants' },
    { value: 'org-only', label: 'Only organization participants' },
  ];
  const nonAttendAccessOptions: SelectOption[] = [
    { value: 'all-org', label: scopeWord === 'team' ? 'All team members' : 'All organization members' },
    { value: 'participants', label: 'Only meeting participants' },
  ];
  const participantModeOptions: SelectOption[] = [...participantAccessOptions, { value: 'customize', label: 'Customize by capture type' }];
  const nonAttendModeOptions: SelectOption[] = [...nonAttendAccessOptions, { value: 'customize', label: 'Customize by capture type' }];

  const pickParticipantMode = (mode: string | number) => {
    if (mode === 'customize') {
      const prev = ['all-participants', 'acme-only', 'org-only'].includes(s.participantMode) ? s.participantMode : 'all-participants';
      setS((p) => ({ ...p, participantMode: 'customize', participantBot: prev, participantDesk: prev }));
    } else {
      set('participantMode', String(mode));
    }
  };
  const pickNonAttendMode = (mode: string | number) => {
    if (mode === 'customize') {
      const prev = ['all-org', 'participants'].includes(s.nonAttendMode) ? s.nonAttendMode : 'all-org';
      setS((p) => ({ ...p, nonAttendMode: 'customize', nonAttendBot: prev, nonAttendDesk: prev }));
    } else {
      set('nonAttendMode', String(mode));
    }
  };

  const Root: ElementType = embed ? Fragment : 'div';
  const rootProps: Record<string, unknown> = embed ? {} : { className: 'set-page' };

  return (
    <Root {...rootProps}>
      {!embed && (
        <header className="set-page__head">
          <h1 className="set-page__title">{orgAdmin ? 'Meetings' : 'My Meetings'}</h1>
          <p className="set-page__sub">{orgAdmin
            ? 'Set meeting capture and access defaults for your organization.'
            : "Customize how your meetings get captured, shared, and summarized."}</p>
        </header>
      )}

      {/* Section 1: Capture settings */}
      <section className="set-section">
        <div className="set-sub__head">
          <div className="set-sub__titles">
            <h2 className="set-sub__title">{orgAdmin ? 'Default capture settings' : 'Capture settings'}</h2>
            <p className="set-sub__sub">{orgAdmin
              ? `These apply to every ${scopeWord} member unless overridden. Turn off member overrides to make it so members cannot change these settings.`
              : "Set how you'd like Grain to capture your meetings."}</p>
          </div>
        </div>

        {orgAdmin && (
          <div className="set-card oa-cap-card oa-cap-card--toggle oa-cap-card--override">
            <div className="set-sub__head">
              <span className="set-sub__icon"><Icon name="refresh" size={16} /></span>
              <div className="set-sub__titles">
                <h2 className="set-sub__title">Allow member overrides</h2>
                <p className="set-sub__sub">{`When on, members can change these capture defaults from their personal settings. Turn off to lock these settings ${scopeWord}-wide.`}</p>
              </div>
              <ToggleSwitch checked={s.allowCaptureOverrides} onChange={(v) => set('allowCaptureOverrides', v)} />
            </div>
          </div>
        )}

        <CaptureMethodCard s={s} set={set} />
      </section>

      {/* Section 2: Access settings */}
      <section className="set-section">
        <div className="set-sub__head">
          <div className="set-sub__titles">
            <h2 className="set-sub__title">{orgAdmin ? 'Default access settings' : 'Access settings'}</h2>
            <p className="set-sub__sub">{orgAdmin
              ? `Set who can access recordings and shared links by default across your ${scopeWord}.`
              : 'Control who can access your meeting captures.'}</p>
          </div>
        </div>

        {orgAdmin && (
          <div className="set-card oa-cap-card oa-cap-card--toggle oa-cap-card--override">
            <div className="set-sub__head">
              <span className="set-sub__icon"><Icon name="refresh" size={16} /></span>
              <div className="set-sub__titles">
                <h2 className="set-sub__title">Allow member overrides</h2>
                <p className="set-sub__sub">{`When on, ${scopeWord} members can change these access defaults in their personal settings. Turn off to require everyone to use the ${scopeWord} defaults.`}</p>
              </div>
              <ToggleSwitch checked={s.allowShareOverrides} onChange={(v) => set('allowShareOverrides', v)} />
            </div>
          </div>
        )}

        {orgAdmin ? (
          <div className="set-card oa-rec-card">
            <div className="set-sub__head oa-rec-head">
              <div className="set-sub__titles">
                <h3 className="set-sub__title">Meeting access</h3>
                <p className="set-sub__sub">Control who can access recordings created by bot capture or desktop capture.</p>
              </div>
            </div>

            <div className="oa-rec-section">
              <div className="set-inline">
                <div className="set-inline__text">
                  <p className="oa-rec-section__label">Sensitivity instructions</p>
                  <p className="set-inline__desc set-inline__desc--wide oa-sens-desc" style={{ marginTop: 6 }}>
                    Tell Grain what types of meetings should be marked sensitive. Sensitive meetings are not automatically shared with people who did not attend. <strong style={{ color: 'var(--fg-1)', fontWeight: 600 }}>Sensitive meetings are never shared.</strong>
                  </p>
                </div>
                <button type="button" className="set-customize" onClick={openSensModal}>Edit instructions</button>
              </div>
            </div>

            <div className="oa-rec-section">
              <div className="set-inline">
                <div className="set-inline__text">
                  <p className="oa-rec-section__label">Access for nonparticipants</p>
                  <p className="oa-rec-section__sub">{`For non-sensitive meetings, choose whether ${scopeWord} members who did not attend can access the recording. Applies to bot and desktop capture unless customized.`}</p>
                </div>
                <Select width={240} value={s.nonAttendMode} onChange={pickNonAttendMode} options={nonAttendModeOptions} />
              </div>
              {s.nonAttendMode === 'customize' && (
                <div className="capture-matrix" role="group" aria-label="Nonparticipant access per capture type">
                  <div className="capture-matrix__row">
                    <div className="capture-matrix__text oa-cap-row__text"><span className="set-sub__icon oa-cap-row__icon"><Icon name="video" size={18} /></span><p className="capture-matrix__title">Bot capture</p></div>
                    <Select width={240} value={s.nonAttendBot} onChange={(v) => set('nonAttendBot', String(v))} options={nonAttendAccessOptions} />
                  </div>
                  <div className="capture-matrix__row">
                    <div className="capture-matrix__text oa-cap-row__text"><span className="set-sub__icon oa-cap-row__icon"><Icon name="audioLines" size={18} /></span><p className="capture-matrix__title">Desktop capture</p></div>
                    <Select width={240} value={s.nonAttendDesk} onChange={(v) => set('nonAttendDesk', String(v))} options={nonAttendAccessOptions} />
                  </div>
                </div>
              )}
            </div>

            <div className="oa-rec-section">
              <div className="set-inline">
                <div className="set-inline__text">
                  <p className="oa-rec-section__label">Access for meeting participants</p>
                  <p className="oa-rec-section__sub">Choose which meeting participants automatically get access to recordings. Applies to bot and desktop capture unless customized.</p>
                </div>
                <Select width={240} value={s.participantMode} onChange={pickParticipantMode} options={participantModeOptions} />
              </div>
              {s.participantMode === 'customize' && (
                <div className="capture-matrix" role="group" aria-label="Participant access per capture type">
                  <div className="capture-matrix__row">
                    <div className="capture-matrix__text oa-cap-row__text"><span className="set-sub__icon oa-cap-row__icon"><Icon name="video" size={18} /></span><p className="capture-matrix__title">Bot capture</p></div>
                    <Select width={240} value={s.participantBot} onChange={(v) => set('participantBot', String(v))} options={participantAccessOptions} />
                  </div>
                  <div className="capture-matrix__row">
                    <div className="capture-matrix__text oa-cap-row__text"><span className="set-sub__icon oa-cap-row__icon"><Icon name="audioLines" size={18} /></span><p className="capture-matrix__title">Desktop capture</p></div>
                    <Select width={240} value={s.participantDesk} onChange={(v) => set('participantDesk', String(v))} options={participantAccessOptions} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="set-card">
            <div className="set-row">
              <div className="set-inline">
                <div className="set-inline__text">
                  <p className="set-inline__title">Default access for participants</p>
                  <p className="set-inline__desc">Choose which meeting participants automatically get access to meetings you record.</p>
                </div>
                <Select
                  width={220}
                  value={s.participantAccess}
                  onChange={(v) => set('participantAccess', String(v))}
                  options={participantAccessOptions}
                />
              </div>
            </div>

            <div className="set-row">
              <p className="set-inline__title">Default access for nonparticipants</p>
              <p className="set-inline__desc" style={{ marginTop: 2 }}>Choose which workspace members get access to meetings they did not attend.</p>
            </div>

            <div className="set-row set-row--continuation">
              <div className="oa-sens-row">
                <div className="oa-sens-main">
                  <span className="sens-tag sens-tag--low"><span className="sens-tag__dot" aria-hidden="true" />Not sensitive</span>
                  <p className="set-inline__desc set-inline__desc--wide oa-sens-desc">Meetings that do not contain any information that would be sensitive to a broad organization-wide audience.</p>
                </div>
                <Select
                  width={220}
                  value={s.accessNotSensitive}
                  onChange={(v) => set('accessNotSensitive', String(v))}
                  options={[
                    { value: 'workspace', label: 'All workspace members' },
                    { value: 'participants', label: 'Only meeting participants' },
                  ]}
                />
              </div>
            </div>

            <div className="set-row">
              <div className="oa-sens-row">
                <span className="sens-tag sens-tag--high"><span className="sens-tag__dot" aria-hidden="true" />Sensitive</span>
              </div>
              <p className="set-inline__desc set-inline__desc--wide oa-sens-desc"><strong style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Only participants</strong> — Sensitive meetings are not automatically shared with nonparticipants.</p>
            </div>
          </div>
        )}
      </section>

      {/* Section 3: Link access default */}
      <section className="set-section">
        <div className="set-card">
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
                  { value: 'workspace', label: 'Anyone in organization' },
                  { value: 'invited', label: 'Invited people only' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {showArtboard && <FallbackNotificationArtboard />}

      {sensModalOpen && (
        <div className="sens-modal__overlay" onMouseDown={cancelSensModal}>
          <div className="sens-modal" role="dialog" aria-modal="true" aria-labelledby="sens-modal-title" onMouseDown={(e) => e.stopPropagation()}>
            <div className="sens-modal__head">
              <div className="sens-modal__titles">
                <h2 className="sens-modal__title" id="sens-modal-title">Meeting Sensitivity Instructions</h2>
                <p className="sens-modal__desc">Tell Grain what types of meetings should be marked sensitive. Sensitive meetings are not automatically shared with people who did not attend.</p>
              </div>
              <button type="button" className="mm-close" aria-label="Close" onClick={cancelSensModal}>
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="sens-modal__body">
              <label className="sens-modal__label" htmlFor="sens-modal-field">Instructions</label>
              <textarea
                id="sens-modal-field"
                className="sens-modal__textarea"
                value={sensDraft}
                onChange={(e) => setSensDraft(e.target.value)}
                placeholder="Example: Mark meetings as sensitive if they include legal, HR, compensation, performance, security, fundraising, or confidential customer information."
                rows={6}
              />
            </div>

            <div className="sens-modal__foot">
              <button type="button" className="set-customize" onClick={cancelSensModal}>Cancel</button>
              <button type="button" className="sens-modal__save" onClick={saveSensModal}>Save</button>
            </div>
          </div>
        </div>
      )}
    </Root>
  );
}
