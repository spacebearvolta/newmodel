import { useEffect, useState } from 'react';
import { CreatorApp } from './creator/CreatorApp';
import { JoinerApp } from './joiner/JoinerApp';
import { HookGallery } from './HookGallery';
import { TweaksPanel, TweakSection, TweakButton, TweakRadio, TweakToggle, TweakSelect, useTweaks } from './tweaks/TweaksPanel';

interface Defaults {
  persona: 'creator' | 'joiner';
  joinerInOrg: boolean;
  trialDays: number;
  trialOver: boolean;
  hasMeetings: boolean;
  wrapInMacChrome: boolean;
  paidOrgOnDomain: boolean;
  emptyDomain: boolean;
  mcpFirstMeetingBanner: boolean;
  graceDays: number;
  teammateNudge: boolean;
  skipOnboarding: boolean;
}

const DEFAULTS: Defaults = {
  persona: 'creator',
  joinerInOrg: false,
  trialDays: 5,
  trialOver: false,
  hasMeetings: true,
  wrapInMacChrome: true,
  paidOrgOnDomain: true,
  emptyDomain: true,
  mcpFirstMeetingBanner: false,
  graceDays: 30,
  teammateNudge: true,
  skipOnboarding: false,
};

export function AppShell() {
  const [t, setT] = useTweaks<Defaults>(DEFAULTS);
  const [galleryOpen, setGalleryOpen] = useState(false);

  // Arriving fresh from onboarding ("personal use" or workspace setup) must
  // never land on a stale flow tweak like an expired trial — a brand-new
  // account starts as a creator with the trial state cleared.
  useEffect(() => {
    try {
      if (localStorage.getItem('grain.freshFromOnboarding') === '1') {
        localStorage.removeItem('grain.freshFromOnboarding');
        setT({ persona: 'creator', trialOver: false, hasMeetings: false, mcpFirstMeetingBanner: false });
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist so the "/" route guard's pre-render check sends the reviewer
  // straight to Meetings on the next load instead of replaying onboarding.
  useEffect(() => {
    try { localStorage.setItem('grain.skipOnboarding', t.skipOnboarding ? '1' : '0'); } catch { /* ignore */ }
  }, [t.skipOnboarding]);

  useEffect(() => {
    try { sessionStorage.setItem('grain.enteredApp', '1'); } catch { /* ignore */ }
  }, []);

  const reset = () => {
    try {
      localStorage.removeItem('grain.orgCreated');
      localStorage.removeItem('grain.orgName');
      localStorage.removeItem('grain.onboarded');
      localStorage.removeItem('grain.trialSeen');
    } catch { /* ignore */ }
    window.location.href = '/onboarding';
  };

  const flow = t.persona === 'creator'
    ? (
      <CreatorApp
        key="creator"
        trialDays={t.trialDays}
        hasMeetings={t.hasMeetings}
        trialOver={t.trialOver}
        paidOrgOnDomain={t.paidOrgOnDomain}
        emptyDomain={t.emptyDomain}
        graceDays={t.graceDays}
        teammateNudge={t.teammateNudge}
        showClaudeBanner={t.mcpFirstMeetingBanner}
      />
    )
    : <JoinerApp key="joiner" hasMeetings={t.hasMeetings} inOrg={t.joinerInOrg} onReset={reset} />;

  return (
    <>
      {t.wrapInMacChrome ? (
        <div className="mac-shell">
          <div className="mac-shell__window">
            <div className="mac-titlebar">
              <div className="mac-traffic"><span /><span /><span /></div>
              <div className="mac-titlebar__title">Grain</div>
            </div>
            <div className="mac-body">{flow}</div>
          </div>
        </div>
      ) : flow}

      <HookGallery open={galleryOpen} onClose={() => setGalleryOpen(false)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Review">
          <TweakButton label="▶ Hook gallery" onClick={() => setGalleryOpen(true)} />
        </TweakSection>
        <TweakSection label="Flow">
          <TweakRadio
            label="Persona"
            value={t.persona}
            onChange={(v) => setT('persona', v)}
            options={[{ value: 'creator', label: 'Creator' }, { value: 'joiner', label: 'Joiner' }]}
          />
          {t.persona === 'joiner' && (
            <TweakToggle label="Part of org" value={t.joinerInOrg} onChange={(v) => setT('joinerInOrg', v)} />
          )}
          {t.persona === 'creator' && (
            <>
              <TweakSelect
                label="Trial: days left"
                value={t.trialDays}
                onChange={(v) => setT('trialDays', Number(v))}
                options={[
                  { value: 14, label: 'Start (14 days)' },
                  { value: 8, label: '8 days left' },
                  { value: 5, label: '5 days left' },
                  { value: 3, label: '3 days left' },
                  { value: 1, label: '1 day left' },
                ]}
              />
              <TweakToggle label="Trial over (org inactive)" value={t.trialOver} onChange={(v) => setT('trialOver', v)} />
              {t.trialOver && (
                <TweakSelect
                  label="Grace: days left (H7)"
                  value={t.graceDays}
                  onChange={(v) => setT('graceDays', Number(v))}
                  options={[
                    { value: 30, label: '30 days saved' },
                    { value: 7, label: '7 days · deletion countdown' },
                    { value: 3, label: '3 days left' },
                    { value: 1, label: '1 day left' },
                  ]}
                />
              )}
              <TweakToggle label="Teammate joined nudge (H9)" value={t.teammateNudge} onChange={(v) => setT('teammateNudge', v)} />
              <TweakToggle label="Paid org already on domain" value={t.paidOrgOnDomain} onChange={(v) => setT('paidOrgOnDomain', v)} />
              <TweakToggle label="No teammates to suggest (Gmail)" value={t.emptyDomain} onChange={(v) => setT('emptyDomain', v)} />
            </>
          )}
          <TweakToggle
            label="Existing personal meetings"
            value={t.hasMeetings}
            onChange={(v) => setT(v ? { hasMeetings: true, mcpFirstMeetingBanner: false } : { hasMeetings: false })}
          />
        </TweakSection>
        <TweakSection label="Connectors">
          <TweakToggle
            label="MCP 1st meeting banner"
            value={t.mcpFirstMeetingBanner}
            onChange={(v) => setT(v ? { mcpFirstMeetingBanner: true, hasMeetings: false } : { mcpFirstMeetingBanner: false })}
          />
        </TweakSection>
        <TweakSection label="Presentation">
          <TweakButton label="Trigger onboarding" onClick={() => { window.location.href = '/onboarding'; }} />
          <TweakToggle label="Skip onboarding on load" value={t.skipOnboarding} onChange={(v) => setT('skipOnboarding', v)} />
          <TweakToggle label="Mac chrome" value={t.wrapInMacChrome} onChange={(v) => setT('wrapInMacChrome', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
