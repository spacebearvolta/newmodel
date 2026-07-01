// HookGallery.jsx — A reviewer slideshow of every upgrade/trial hook in the app.
//
// Opened from the Tweaks panel. Renders each hook one at a time on a dark
// stage (a faint app silhouette behind for context), with prev/next, optional
// state switches (e.g. grace-day counts), and the trigger description.
//
// All hook components are pulled from window (OrgShell, TrialCountdown,
// TrialHooks, FlowCreator, MeetingsSurface), so this file just composes them.

const HG_NOOP = () => {};
const HG_MEETING = { title: 'Q2 planning offsite — day 1', date: 'Recorded May 8' };

// Inline recreation of the H6 integrations gate (that surface lives on a
// separate page; this mirrors it for the gallery).
function HgGateCard() {
  return (
    <div className="hg-gate">
      <div className="hg-gate__eyebrow"><Icon name="sparkles" size={13} /> Grain Business · free for 14 days</div>
      <div className="hg-gate__logo">H</div>
      <h2 className="hg-gate__title">Try Grain Business to connect HubSpot</h2>
      <p className="hg-gate__desc">Skip the manual data entry, auto-sync AI notes to HubSpot Contact and Meeting objects.</p>
      <button className="btn btn--dark btn--pill btn--lg"><span className="btn-label">Start free trial</span></button>
    </div>
  );
}

const HG_HOOKS = [
  {
    tag: 'H1', title: 'Recording length wall',
    trigger: 'A free user starts a recording — or uploads a file — longer than 45 minutes.',
    kind: 'modal',
    states: ['Recording', 'Upload'],
    render: (s) => <RecordingLimitModal open kind={s === 1 ? 'upload' : 'record'} onClose={HG_NOOP} onStartTrial={HG_NOOP} />,
  },
  {
    tag: 'H2', title: 'History approaching 30-day lock',
    trigger: 'A free user has meetings nearing the 30-day history limit (shown on My meetings).',
    kind: 'inline',
    states: ['5 days', '3 days', '1 day'],
    render: (s) => <div style={{ width: 620, maxWidth: '88vw' }}><HistoryLockBanner daysLeft={[5, 3, 1][s]} onStartTrial={HG_NOOP} onDismiss={HG_NOOP} /></div>,
  },
  {
    tag: 'H3', title: 'Locked meeting (past 30 days)',
    trigger: 'A free user opens a meeting older than the 30-day free history window.',
    kind: 'modal',
    render: () => <LockedMeetingModal meeting={HG_MEETING} onClose={HG_NOOP} onStartTrial={HG_NOOP} />,
  },
  {
    tag: 'H4 · H5', title: 'Invite / Share value modal',
    trigger: 'A free user clicks Invite, or tries to share a recording with a colleague.',
    kind: 'modal',
    states: ['Invite', 'Share'],
    render: (s) => <TeamValueModal trigger={s === 1 ? 'share' : 'invite'} onClose={HG_NOOP} onStartTrial={HG_NOOP} />,
  },
  {
    tag: 'H6', title: 'CRM connection gate',
    trigger: 'A free user opens a CRM / workspace integration (HubSpot, Salesforce, …).',
    kind: 'inline',
    render: () => <HgGateCard />,
  },
  {
    tag: 'H7', title: 'Trial expired — interstitial',
    trigger: 'Shown once on the first login after the Business trial ends.',
    kind: 'modal',
    states: ['30 days', '7 days', '3 days', '1 day'],
    render: (s) => <TrialExpiredInterstitial open orgName="Acme" graceDays={[30, 7, 3, 1][s]} onUpgrade={HG_NOOP} onContinueFree={HG_NOOP} />,
  },
  {
    tag: 'H7', title: 'Trial-ended widget (grace countdown)',
    trigger: 'Persistent sidebar card after the trial ends; counts down the grace period.',
    kind: 'inline',
    states: ['30 days', '7 days', '1 day'],
    render: (s) => <div style={{ width: 244 }}><TrialEndedCard orgName="Acme" graceDays={[30, 7, 1][s]} onUpgrade={HG_NOOP} onTalkToSales={HG_NOOP} onDismiss={HG_NOOP} /></div>,
  },
  {
    tag: 'H8', title: 'Feature-usage nudge',
    trigger: 'Mid-trial use of a Business-only feature — team meetings, sharing, AI actions, integrations.',
    kind: 'inline',
    states: ['Team meetings', 'Sharing', 'AI actions', 'Integrations'],
    render: (s) => <FeatureNudgeChip feature={['Team meetings', 'Sharing to a team', 'AI actions on shared meetings', 'Workspace integrations'][s]} daysLeft={8} onDismiss={HG_NOOP} />,
  },
  {
    tag: 'H9', title: 'Teammate engagement nudge',
    trigger: 'A teammate’s first meeting is captured in the trial workspace.',
    kind: 'inline',
    render: () => <TeammateNudge name="Maya Chen" daysLeft={8} onView={HG_NOOP} onClose={HG_NOOP} />,
  },
  {
    tag: 'Trial', title: 'Trial countdown widget',
    trigger: 'Persistent sidebar card throughout the active Business trial.',
    kind: 'inline',
    states: ['14', '8', '5', '3', '1'],
    render: (s) => <div style={{ width: 244 }}><TrialWidget daysLeft={[14, 8, 5, 3, 1][s]} orgName="Acme" onUpgrade={HG_NOOP} onOpen={HG_NOOP} /></div>,
  },
  {
    tag: 'Trial', title: 'Trial countdown popup',
    trigger: 'Opens from the trial pill / widget at milestone days remaining.',
    kind: 'modal',
    states: ['8 days', '3 days', '1 day'],
    render: (s) => <TrialCountdown daysLeft={[8, 3, 1][s]} orgName="Acme" onUpgrade={HG_NOOP} onClose={HG_NOOP} />,
  },
];

function HookGallery({ open, onClose }) {
  const [i, setI] = React.useState(0);
  const [s, setS] = React.useState(0);
  const hook = HG_HOOKS[i];

  const go = React.useCallback((delta) => {
    setI((prev) => {
      const next = Math.min(HG_HOOKS.length - 1, Math.max(0, prev + delta));
      return next;
    });
    setS(0);
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go, onClose]);

  React.useEffect(() => { if (open) { setI(0); setS(0); } }, [open]);

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

      {hook.kind === 'inline'
        ? <div className="hg-stage" key={`${i}-${s}`}>{hook.render(s)}</div>
        : <React.Fragment key={`${i}-${s}`}>{hook.render(s)}</React.Fragment>}

      <div className="hg-top">
        <span className="hg-top__label">
          <Icon name="sparkles" size={14} /> Hook gallery
          <span className="hg-top__count">{i + 1} / {HG_HOOKS.length}</span>
        </span>
        <button className="hg-close" aria-label="Close gallery" onClick={onClose}><Icon name="close" size={18} /></button>
      </div>

      <button className="hg-nav hg-nav--prev" aria-label="Previous" disabled={i === 0} onClick={() => go(-1)}><Icon name="chevLeft" size={22} /></button>
      <button className="hg-nav hg-nav--next" aria-label="Next" disabled={i === HG_HOOKS.length - 1} onClick={() => go(1)}><Icon name="chevRight" size={22} /></button>

      <div className="hg-bottom">
        <span className="hg-bottom__tag">{hook.tag}</span>
        <div className="hg-bottom__title">{hook.title}</div>
        <p className="hg-bottom__desc">{hook.trigger}</p>
        {hook.states && (
          <div className="hg-states" role="tablist" aria-label="States">
            {hook.states.map((label, idx) => (
              <button key={label} className={`hg-state ${idx === s ? 'is-on' : ''}`} onClick={() => setS(idx)}>{label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { HookGallery });
