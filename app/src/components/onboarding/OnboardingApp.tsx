import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ObWelcome, ObSurvey, ObPermissions, ObAutoCapture, ObClaude, ObUseSelect, ObTrial,
} from './OnboardingScreens';
import { NameStep, CreatingStep, CreatorInviteStep, SuccessStep } from '../creator/FlowCreatorSteps';
import { TweaksPanel, TweakSection, TweakToggle, TweakButton, useTweaks } from '../tweaks/TweaksPanel';
import { USER, DOMAIN_PEERS, orgNameFromDomain } from '../../data/meetings';

type Screen = 'welcome' | 'survey' | 'permissions' | 'autocapture' | 'claude' | 'use' | 'trial' | 'setup';

function finishOnboarding(navigate: ReturnType<typeof useNavigate>, org: boolean, orgName?: string) {
  try {
    localStorage.setItem('grain.onboarded', '1');
    // One-shot flag: the app home consumes this and resets flow tweaks
    // (creator persona, trial not over) so a fresh sign-up never lands on a
    // stale state like an expired trial.
    localStorage.setItem('grain.freshFromOnboarding', '1');
    if (org) {
      localStorage.setItem('grain.orgCreated', '1');
      localStorage.setItem('grain.orgName', orgName || 'Acme');
    } else {
      localStorage.removeItem('grain.orgCreated');
      localStorage.removeItem('grain.orgName');
    }
  } catch { /* ignore */ }
  navigate('/');
}

function WorkspaceSetup({ onCancel, emptyDomain, navigate }: { onCancel: () => void; emptyDomain: boolean; navigate: ReturnType<typeof useNavigate> }) {
  const [sub, setSub] = useState<'name' | 'creating' | 'invite' | 'done'>('name');
  const [orgName, setOrgName] = useState(() => orgNameFromDomain(USER.domain));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const invitePeers = emptyDomain ? [] : DOMAIN_PEERS;

  const toCreating = () => {
    setSub('creating');
    setTimeout(() => setSub('invite'), 1500);
  };
  const toggle = (email: string) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(email)) next.delete(email); else next.add(email);
    return next;
  });

  const size = sub === 'invite' ? 'lg' : 'md';
  let step;
  if (sub === 'name') {
    step = <NameStep orgName={orgName} onName={setOrgName} onClose={onCancel} onNext={toCreating} />;
  } else if (sub === 'creating') {
    step = <CreatingStep orgName={orgName} />;
  } else if (sub === 'invite') {
    step = (
      <CreatorInviteStep
        orgName={orgName}
        peers={invitePeers}
        selected={selected}
        onToggle={toggle}
        onSelectAll={() => setSelected(new Set(invitePeers.map((p) => p.email)))}
        onClear={() => setSelected(new Set())}
        onSkip={() => setSub('done')}
        onNext={() => setSub('done')}
        onClose={onCancel}
      />
    );
  } else {
    step = (
      <SuccessStep orgName={orgName} onDone={() => finishOnboarding(navigate, true, orgName)} />
    );
  }

  return (
    <div className="ob-stage ob-stage--neutral">
      <div className="ob-scroll">
        <div className="ob-setup">
          <div className={`modal modal--${size}`}>{step}</div>
        </div>
      </div>
    </div>
  );
}

interface OnboardingTweaks {
  wrapInMacChrome: boolean;
  mcpSetup: boolean;
  emptyDomain: boolean;
}

export function OnboardingApp() {
  const navigate = useNavigate();
  const [t, setT] = useTweaks<OnboardingTweaks>({ wrapInMacChrome: true, mcpSetup: true, emptyDomain: false });
  const [screen, setScreen] = useState<Screen>('welcome');

  useEffect(() => { try { sessionStorage.setItem('grain.enteredApp', '1'); } catch { /* ignore */ } }, []);

  let view;
  if (screen === 'welcome') view = <ObWelcome onContinue={() => setScreen('survey')} />;
  else if (screen === 'survey') view = <ObSurvey onNext={() => setScreen('permissions')} />;
  else if (screen === 'permissions') view = <ObPermissions onNext={() => setScreen('autocapture')} />;
  else if (screen === 'autocapture') view = <ObAutoCapture onNext={() => setScreen(t.mcpSetup ? 'claude' : 'use')} />;
  else if (screen === 'claude') view = <ObClaude onConnected={() => setScreen('use')} onSkip={() => setScreen('use')} />;
  else if (screen === 'use') view = <ObUseSelect onSelect={(c) => (c === 'team' ? setScreen('trial') : finishOnboarding(navigate, false))} />;
  else if (screen === 'trial') view = <ObTrial onStart={() => setScreen('setup')} onSelf={() => finishOnboarding(navigate, false)} />;
  else view = <WorkspaceSetup onCancel={() => setScreen('trial')} emptyDomain={t.emptyDomain} navigate={navigate} />;

  const label = {
    welcome: 'Welcome', survey: 'Personalize', permissions: 'Permissions', autocapture: 'Auto-capture',
    claude: 'Connect Claude', use: 'Personal or team', trial: 'Start trial', setup: 'Create workspace',
  }[screen];

  const host = <div className="ob-host" data-screen-label={`Onboarding — ${label}`}>{view}</div>;

  return (
    <>
      {t.wrapInMacChrome ? (
        <div className="mac-shell">
          <div className="mac-shell__window">
            <div className="mac-titlebar">
              <div className="mac-traffic"><span /><span /><span /></div>
              <div className="mac-titlebar__title">Grain</div>
            </div>
            <div className="mac-body">{host}</div>
          </div>
        </div>
      ) : (
        <div className="ob-novchrome">{host}</div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Connectors">
          <TweakToggle label="MCP setup screen" value={t.mcpSetup} onChange={(v) => setT('mcpSetup', v)} />
        </TweakSection>
        <TweakSection label="Workspace setup">
          <TweakToggle label="No teammates to suggest (Gmail)" value={t.emptyDomain} onChange={(v) => setT('emptyDomain', v)} />
        </TweakSection>
        <TweakSection label="Presentation">
          <TweakButton label="Skip onboarding → Meetings" onClick={() => navigate('/')} />
          <TweakToggle label="Mac chrome" value={t.wrapInMacChrome} onChange={(v) => setT('wrapInMacChrome', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
