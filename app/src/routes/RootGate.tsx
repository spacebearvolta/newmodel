import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppShell } from '../components/AppShell';

// Ported from Meetings.html's pre-React redirect guard: every fresh open of
// the prototype starts at Onboarding, unless the reviewer explicitly asked
// for the app (?app / #app), just finished onboarding (one-shot flag), has
// opted to skip it, or already entered this tab-session (so a tweak-driven
// reload doesn't bounce back to onboarding mid-review). Checked once per
// mount, not reactively — matches the original's one-time page-load check.
export function RootGate() {
  const location = useLocation();
  const [goToOnboarding] = useState(() => {
    try {
      const wantsApp = location.search.includes('app') || location.hash.includes('app');
      const fresh = localStorage.getItem('grain.freshFromOnboarding') === '1';
      const skip = localStorage.getItem('grain.skipOnboarding') === '1';
      const entered = sessionStorage.getItem('grain.enteredApp') === '1';
      return !wantsApp && !fresh && !skip && !entered;
    } catch {
      return false;
    }
  });

  if (goToOnboarding) return <Navigate to="/onboarding" replace />;
  return <AppShell />;
}
