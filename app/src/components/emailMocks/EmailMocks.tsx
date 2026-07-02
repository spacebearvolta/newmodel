// EmailMocks.tsx — Designed email mockups for the post-trial hooks.
//   H7 email — trial-ended grace reminder
//   H9 email — teammate's first meeting captured
// Rendered inside a lightweight "inbox" frame (from / subject) on a grey
// backdrop, so the email design can be reviewed on its own.
import type { ReactNode } from 'react';
import { Icon } from '../primitives/Icon';

const GRAIN_GREEN = '#16A35F';

function EmailFrame({ from, fromAddr, subject, children }: { from: string; fromAddr: string; subject: string; children: ReactNode }) {
  return (
    <div className="em-frame">
      <div className="em-meta">
        <div className="em-meta__avatar" style={{ background: GRAIN_GREEN }}>G</div>
        <div className="em-meta__lines">
          <div className="em-meta__row1">
            <span className="em-meta__from">{from}</span>
            <span className="em-meta__addr">&lt;{fromAddr}&gt;</span>
          </div>
          <div className="em-meta__subject">{subject}</div>
        </div>
      </div>
      <div className="em-body">{children}</div>
    </div>
  );
}

function EmailShell({ children }: { children: ReactNode }) {
  return (
    <div className="em-card">
      <div className="em-card__head">
        <span className="em-logo"><span className="em-logo__mark">G</span> Grain</span>
      </div>
      <div className="em-card__inner">{children}</div>
      <div className="em-card__foot">
        <p>Grain Intelligence, Inc. · 2261 Market St, San Francisco, CA</p>
        <p><a href="#" onClick={(e) => e.preventDefault()}>Notification settings</a> · <a href="#" onClick={(e) => e.preventDefault()}>Unsubscribe</a></p>
      </div>
    </div>
  );
}

function TrialEndedEmail({ orgName = 'Acme', graceDays = 30 }: { orgName?: string; graceDays?: number }) {
  return (
    <EmailFrame from="Grain" fromAddr="hello@grain.com" subject={`Your Grain Business trial has ended: your meetings are saved for ${graceDays} days`}>
      <EmailShell>
        <div className="em-icon em-icon--warm"><Icon name="clock" /></div>
        <h1 className="em-h1">Your Business trial has ended</h1>
        <p className="em-p">Hi Jeff,</p>
        <p className="em-p">Your Grain Business trial for <strong>{orgName}</strong> has wrapped up. Good news, nothing's gone. Your organization's shared meetings are saved for the next <strong>{graceDays} days</strong>. Reactivate any time to switch your workspace back on and keep everything.</p>
        <div className="em-callout">
          <span className="em-callout__icon"><Icon name="shield" size={16} /></span>
          <div>
            <div className="em-callout__title">Saved for {graceDays} days</div>
            <div className="em-callout__sub">We'll remind you before any meeting history is removed. Until then, everything stays recoverable.</div>
          </div>
        </div>
        <a className="em-btn em-btn--dark" href="#" onClick={(e) => e.preventDefault()}>Reactivate{' '}{orgName}</a>
        <p className="em-secondary"><a href="#" onClick={(e) => e.preventDefault()}>Continue on the free plan</a></p>
        <p className="em-fineprint">On the free plan you keep your most recent 30 days of meetings and a 45-minute recording limit. Meetings you recorded or joined always stay yours.</p>
      </EmailShell>
    </EmailFrame>
  );
}

function TeammateEmail({ orgName = 'Acme', daysLeft = 8, teammate = 'Maya Chen' }: { orgName?: string; daysLeft?: number; teammate?: string }) {
  const first = teammate.split(' ')[0];
  return (
    <EmailFrame from="Grain" fromAddr="hello@grain.com" subject={`${first} had their first meeting captured in ${orgName}`}>
      <EmailShell>
        <div className="em-eyebrow"><Icon name="sparkles" size={14} /> Your trial is working</div>
        <h1 className="em-h1">{first} just had their first meeting captured</h1>
        <p className="em-p">Hi Jeff,</p>
        <p className="em-p"><strong>{teammate}</strong> recorded their first meeting in your <strong>{orgName}</strong> workspace. That's shared context your whole team can search, summarize, and build on: exactly what Grain Business is for.</p>
        <div className="em-mtg">
          <span className="em-mtg__thumb"><Icon name="video" size={18} /></span>
          <div className="em-mtg__text">
            <div className="em-mtg__title">Beacon onboarding kickoff</div>
            <div className="em-mtg__meta">Today · 39 min · Recorded by {teammate}</div>
          </div>
        </div>
        <a className="em-btn em-btn--dark" href="#" onClick={(e) => e.preventDefault()}>See the meeting</a>
        <p className="em-secondary"><strong>{daysLeft} days left</strong> in your trial. Keep the momentum going.</p>
      </EmailShell>
    </EmailFrame>
  );
}

export function EmailMocks({ email = 'trial-ended', orgName = 'Acme', graceDays = 30, daysLeft = 8 }: {
  email?: 'trial-ended' | 'teammate'; orgName?: string; graceDays?: number; daysLeft?: number;
}) {
  return (
    <div className="em-stage">
      {email === 'trial-ended'
        ? <TrialEndedEmail orgName={orgName} graceDays={graceDays} />
        : <TeammateEmail orgName={orgName} daysLeft={daysLeft} />}
    </div>
  );
}
