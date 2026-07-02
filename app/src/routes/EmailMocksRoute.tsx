// EmailMocksRoute.tsx — standalone "Trial emails" review page (H7/H9 email
// designs), reachable at /trial-emails. Ported from "Trial Emails.html".
import { EmailMocks } from '../components/emailMocks/EmailMocks';
import { TweaksPanel, TweakSection, TweakRadio, TweakSelect, useTweaks } from '../components/tweaks/TweaksPanel';

interface Tweaks {
  email: 'trial-ended' | 'teammate';
  graceDays: number;
  daysLeft: number;
}

export function EmailMocksRoute() {
  const [t, setT] = useTweaks<Tweaks>({ email: 'trial-ended', graceDays: 30, daysLeft: 8 });

  return (
    <>
      <EmailMocks email={t.email} graceDays={t.graceDays} daysLeft={t.daysLeft} />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Email">
          <TweakRadio
            label="Which email"
            value={t.email}
            onChange={(v) => setT('email', v)}
            options={[
              { value: 'trial-ended', label: 'Trial ended (H7)' },
              { value: 'teammate', label: 'Teammate (H9)' },
            ]}
          />
          {t.email === 'trial-ended' && (
            <TweakSelect
              label="Grace days"
              value={t.graceDays}
              onChange={(v) => setT('graceDays', Number(v))}
              options={[{ value: 30, label: '30 days' }, { value: 7, label: '7 days' }, { value: 3, label: '3 days' }]}
            />
          )}
          {t.email === 'teammate' && (
            <TweakSelect
              label="Days left"
              value={t.daysLeft}
              onChange={(v) => setT('daysLeft', Number(v))}
              options={[{ value: 14, label: '14 days' }, { value: 8, label: '8 days' }, { value: 3, label: '3 days' }]}
            />
          )}
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
