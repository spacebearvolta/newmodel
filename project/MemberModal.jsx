// MemberModal.jsx — full-screen member settings page-modal.
// Opens from the Members table or from "See member settings" → View on the Our Meetings page.
// Sections: Member details (role/team/seat/status) + Meeting settings (capture + share, mirroring My Meetings).

const ROLE_OPTIONS = [
  { value: 'admin',       label: 'Admin',                description: 'Can change workspace settings, deactivate members, and add other admins.' },
  { value: 'member',      label: 'Member',               description: 'Can invite workspace members and upgrade.' },
  { value: 'deactivated', label: 'Deactivated member',   description: 'Cannot sign in or access workspace recordings.', danger: true },
];

const SEAT_OPTIONS = [
  { value: 'paid',   label: 'Paid',        description: 'Can record, upload and import meetings and access all features on your plan.' },
  { value: 'viewer', label: 'Free viewer', description: 'Can not record, upload or import meetings but can access all other features on your plan.' },
];

const STATUS_OPTIONS = [
  { value: 'active',     label: 'Active',     description: 'Can sign in to your workspace and see all recordings shared with workspace.' },
  { value: 'deactivate', label: 'Deactivate', description: 'Can no longer sign into Grain.', danger: true },
];

const TEAM_OPTIONS = [
  { value: 'grain',      label: 'Grain',           description: '88 members' },
  { value: 'sales',      label: 'Sales',           description: '3 members' },
  { value: 'cs',         label: 'Customer Success', description: '2 members' },
  { value: 'exec',       label: 'Executive Team',  description: '3 members' },
  { value: 'eng',        label: 'Engineering',     description: '12 members' },
  { value: 'product',    label: 'Product',         description: '5 members' },
  { value: 'marketing',  label: 'Marketing',       description: '4 members' },
  { value: 'leadership', label: 'Leadership',      description: '4 members' },
  { value: 'new',        label: 'New Team',        description: '0 members' },
];

const SUBSCRIBED_OPTIONS = [
  ...TEAM_OPTIONS,
  { value: 'none', label: 'None', description: 'Not subscribed to any team' },
];

function MemberDetailField({ label, children }) {
  return (
    <div className="mm-field">
      <div className="mm-field__label">{label}</div>
      <div className="mm-field__value">{children}</div>
    </div>
  );
}

function MemberDetailsCard({ member, set }) {
  return (
    <div className="set-card">
      <div className="set-sub__head">
        <span className="set-sub__icon"><i data-lucide="id-card" /></span>
        <div className="set-sub__titles">
          <h2 className="set-sub__title">Member details</h2>
          <p className="set-sub__sub">Identity, role, and access for this workspace member.</p>
        </div>
      </div>

      <div className="mm-grid">
        <MemberDetailField label="Name">
          <span className="mm-readonly">{member.name}</span>
        </MemberDetailField>
        <MemberDetailField label="Email">
          <span className="mm-readonly">{member.email}</span>
        </MemberDetailField>
        <MemberDetailField label="Workspace Role">
          <RichSelect value={member.role} onChange={(v) => set('role', v)} options={ROLE_OPTIONS} />
        </MemberDetailField>
        <MemberDetailField label="Teams">
          <RichMultiSelect
            values={member.teams}
            onChange={(v) => set('teams', v)}
            options={TEAM_OPTIONS}
            formatTrigger={(vals, opts) => {
              if (vals.length === 0) return 'No teams';
              if (vals.length === 1) return opts.find((o) => o.value === vals[0])?.label || vals[0];
              return `${vals.length} teams`;
            }}
          />
        </MemberDetailField>
        <MemberDetailField label="Subscribed to">
          <RichSelect value={member.subscribed} onChange={(v) => set('subscribed', v)} options={SUBSCRIBED_OPTIONS} />
        </MemberDetailField>
        <MemberDetailField label="Seat">
          <RichSelect value={member.seat} onChange={(v) => set('seat', v)} options={SEAT_OPTIONS} />
        </MemberDetailField>
        <MemberDetailField label="Status">
          <RichSelect value={member.status} onChange={(v) => set('status', v)} options={STATUS_OPTIONS} />
        </MemberDetailField>
      </div>
    </div>
  );
}

// ── Meeting settings (mirrors MyMeetingsNew but parameterized to member state) ──

function MemberCaptureCard({ s, set }) {
  const captureMethodOptions = [
    { value: 'bot',     label: 'Bot capture' },
    { value: 'desktop', label: 'Desktop capture' },
    { value: 'none',    label: "Don't capture" },
  ];

  return (
    <div className="set-card">
      <div className="set-sub__head">
        <span className="set-sub__icon"><i data-lucide="circle-dot" /></span>
        <div className="set-sub__titles">
          <h2 className="set-sub__title">Capture settings</h2>
          <p className="set-sub__sub">How Grain captures this member's meetings.</p>
        </div>
      </div>

      <div className="set-row">
        <div className="set-row__label">Preferred capture method</div>
        <div className="set-row__sub">How this member's meetings get captured.</div>
        <div className="radio-card-group" role="radiogroup">
          <RadioCard
            icon="video"
            title="Bot capture"
            description="The Grain notetaker bot will join calls and record the meeting."
            checked={s.preferredMethod === 'bot'}
            onChange={() => set('preferredMethod', 'bot')}
          />
          <RadioCard
            icon="audio-lines"
            title="Desktop capture"
            description="The Grain desktop app will capture the meeting transcript (no video)."
            checked={s.preferredMethod === 'desktop'}
            onChange={() => set('preferredMethod', 'desktop')}
          />
          <RadioCard
            icon="sliders-horizontal"
            title="Customize"
            description="Select which capture method works best for which meeting type."
            checked={s.preferredMethod === 'customize'}
            onChange={() => set('preferredMethod', 'customize')}
          />
        </div>

        {s.preferredMethod === 'customize' && (
          <div className="capture-matrix">
            <div className="capture-matrix__row">
              <div className="capture-matrix__text">
                <p className="capture-matrix__title">External meetings</p>
                <p className="capture-matrix__sub">Meetings with people outside your workspace.</p>
              </div>
              <Select width={200} value={s.methodExternal} onChange={(v) => set('methodExternal', v)} options={captureMethodOptions} />
            </div>
            <div className="capture-matrix__row">
              <div className="capture-matrix__text">
                <p className="capture-matrix__title">Internal meetings</p>
                <p className="capture-matrix__sub">Meetings with only your workspace members.</p>
              </div>
              <Select width={200} value={s.methodInternal} onChange={(v) => set('methodInternal', v)} options={captureMethodOptions} />
            </div>
            <div className="capture-matrix__row">
              <div className="capture-matrix__text">
                <p className="capture-matrix__title">Unscheduled meetings</p>
                <p className="capture-matrix__sub">Ad-hoc meetings not on the calendar.</p>
              </div>
              <Select width={200} value={s.methodUnscheduled} onChange={(v) => set('methodUnscheduled', v)} options={captureMethodOptions} />
            </div>
          </div>
        )}
      </div>

      {s.preferredMethod === 'bot' && (
        <div className="set-row set-row--continuation">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Only auto-capture if member is the event organizer</p>
              <p className="set-inline__desc">The Grain Bot will only auto-join meetings where this member is the organizer.</p>
            </div>
            <ToggleSwitch checked={s.autoOrganizerOnly} onChange={(v) => set('autoOrganizerOnly', v)} />
          </div>
        </div>
      )}

      {s.preferredMethod === 'desktop' && (
        <div className="set-row set-row--continuation">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Record with bot when desktop capture fails</p>
              <p className="set-inline__desc">Automatically send the Grain bot to record when desktop capture can't start.</p>
            </div>
            <ToggleSwitch checked={s.fallback} onChange={(v) => set('fallback', v)} />
          </div>
        </div>
      )}

      <div className="set-row">
        <div className="set-inline">
          <div className="set-inline__text">
            <p className="set-inline__title">Bot display settings</p>
            <p className="set-inline__desc">Customize how the Grain Bot appears and behaves in meetings.</p>
          </div>
          <button type="button" className="set-customize">Customize</button>
        </div>
      </div>
    </div>
  );
}

function MemberShareCard({ s, set }) {
  const accessOptions = [
    { value: 'workspace',    label: 'All workspace members' },
    { value: 'teams',        label: 'Selected teams & participants' },
    { value: 'participants', label: 'Only meeting participants' },
  ];
  const recapOptions = [
    { value: 'all-participants', label: 'All participants' },
    { value: 'all-internal',     label: 'All internal participants' },
    { value: 'only-me',          label: 'Only me' },
    { value: 'none',             label: "Don't send" },
  ];
  const recapMethodOptions = [
    { value: 'bots',    label: 'Grain bots only' },
    { value: 'desktop', label: 'Desktop capture only' },
    { value: 'both',    label: 'Both' },
  ];
  const recapMeetingTypeOptions = [
    { value: 'internal', label: 'Internal only' },
    { value: 'external', label: 'External only' },
    { value: 'all',      label: 'All' },
  ];
  const SENS_TIERS = [
    { key: 'NotSensitive',       tag: 'Not sensitive',     tagClass: 'low',  desc: 'Meetings that do not contain any information that would be sensitive to a broad organization-wide audience.' },
    { key: 'PossiblySensitive',  tag: 'Somewhat sensitive', tagClass: 'med',  desc: 'Meetings that contain information that might be sensitive, depending on the information transparency in your organization.' },
    { key: 'Sensitive',          tag: 'Sensitive',          tagClass: 'high', desc: 'Meetings that contain information that is almost certainly sensitive to an audience outside the meeting.' },
  ];

  return (
    <div className="set-card">
      <div className="set-sub__head">
        <span className="set-sub__icon"><i data-lucide="users-round" /></span>
        <div className="set-sub__titles">
          <h2 className="set-sub__title">Share settings</h2>
          <p className="set-sub__sub">Who can access this member's meetings and how recap emails go out.</p>
        </div>
      </div>

      {SENS_TIERS.map((tier) => {
        const access = s[`access${tier.key}`];
        const teams = s[`teams${tier.key}`];
        return (
          <div className="set-row" key={tier.key}>
            <div className="set-inline">
              <div className="set-inline__text">
                <div className="sens-row__head">
                  <span className={`sens-tag sens-tag--${tier.tagClass}`}>
                    <span className="sens-tag__dot" aria-hidden="true" />
                    {tier.tag}
                  </span>
                </div>
                <p className="set-inline__desc set-inline__desc--wide">{tier.desc}</p>
              </div>
              <Select width={240} value={access} onChange={(v) => set(`access${tier.key}`, v)} options={accessOptions} />
            </div>
            {access === 'teams' && (
              <TeamMultiSelect selected={teams} onChange={(next) => set(`teams${tier.key}`, next)} />
            )}
          </div>
        );
      })}

      <div className="set-row">
        <div className="set-inline">
          <div className="set-inline__text">
            <p className="set-inline__title">Meeting recap emails</p>
            <p className="set-inline__desc">Who should receive recap emails after the meeting ends?</p>
          </div>
          <Select width={220} value={s.recap} onChange={(v) => set('recap', v)} options={recapOptions} />
        </div>
      </div>

      {s.recap !== 'none' && (
        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Send from capture method</p>
              <p className="set-inline__desc">Which capture types should Grain send recap emails for?</p>
            </div>
            <Select width={220} value={s.recapMethod} onChange={(v) => set('recapMethod', v)} options={recapMethodOptions} />
          </div>
        </div>
      )}

      {s.recap !== 'none' && (
        <div className="set-row">
          <div className="set-inline">
            <div className="set-inline__text">
              <p className="set-inline__title">Send from meeting types</p>
              <p className="set-inline__desc">Which meeting types should Grain send recap emails for?</p>
            </div>
            <Select width={220} value={s.recapMeetingType} onChange={(v) => set('recapMeetingType', v)} options={recapMeetingTypeOptions} />
          </div>
        </div>
      )}

      <div className="set-row">
        <div className="set-inline">
          <div className="set-inline__text">
            <p className="set-inline__title">Link access default</p>
            <p className="set-inline__desc">Who can access this member's meeting recordings with a shared link?</p>
          </div>
          <Select width={220} value={s.linkAccess} onChange={(v) => set('linkAccess', v)} options={[
            { value: 'anyone',    label: 'Anyone with link' },
            { value: 'workspace', label: 'Anyone in workspace' },
            { value: 'invited',   label: 'Invited people only' },
          ]} />
        </div>
      </div>
    </div>
  );
}

// ── Modal shell ────────────────────────────────────────────────────

function MemberSettingsModal({ member, onClose }) {
  // Member-level state — combines profile fields + meeting settings
  const [m, setM] = React.useState(() => ({
    // profile
    name: member.name,
    email: member.email,
    role: 'member',
    teams: member.teams ? member.teams.map((t) => t.toLowerCase().replace(/\s+/g, '')) : ['grain'],
    subscribed: 'grain',
    seat: 'paid',
    status: 'active',
    // capture
    preferredMethod: 'bot',
    methodExternal: 'bot',
    methodInternal: 'desktop',
    methodUnscheduled: 'desktop',
    autoOrganizerOnly: false,
    fallback: true,
    // share
    accessNotSensitive: 'workspace',
    accessPossiblySensitive: 'teams',
    accessSensitive: 'participants',
    teamsNotSensitive: [],
    teamsPossiblySensitive: ['sales', 'cs', 'eng'],
    teamsSensitive: [],
    recap: 'all-participants',
    recapMethod: 'both',
    recapMeetingType: 'all',
    linkAccess: 'anyone',
  }));
  const set = (k, v) => setM((p) => ({ ...p, [k]: v }));

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="mm-overlay" onClick={(e) => { if (e.target.classList.contains('mm-overlay')) onClose(); }}>
      <div className="mm-sheet" role="dialog" aria-modal="true" aria-label={`Member settings — ${member.name}`}>
        <header className="mm-head">
          <button type="button" className="mm-back" onClick={onClose}>
            <i data-lucide="arrow-left" />
            <span>Back to Our Meetings</span>
          </button>
          <button type="button" className="mm-close" onClick={onClose} aria-label="Close">
            <i data-lucide="x" />
          </button>
        </header>
        <div className="mm-body">
          <div className="set-page">
            <header className="set-page__head">
              <h1 className="set-page__title">{member.name}</h1>
              <p className="set-page__sub">{member.email}</p>
            </header>
            <MemberDetailsCard member={m} set={set} />
            <MemberCaptureCard s={m} set={set} />
            <MemberShareCard s={m} set={set} />
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MemberSettingsModal });
