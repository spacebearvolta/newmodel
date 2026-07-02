// OrgAdminTeam.tsx — Org admin → individual team settings page.
// Built from Grain DS primitives: set-card, oa-ws-name/oa-input, Select,
// ToggleSwitch + DS tokens. Manage members / Team default settings are
// inline sections on this page rather than separate drill-downs.
import { useEffect, useState } from 'react';
import { Icon } from '../primitives/Icon';
import { OrgAdminMyMeetings } from './OrgAdminMyMeetings';
import type { OrgTeam } from './OrgAdminSidebar';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  color: string;
  autoRecord: { label: string; info: boolean };
  autoShare: { label: string; info: boolean };
  recap: { label: string; info: boolean };
}

// Executive Team roster shown in the Members table (per the original mock).
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'jw', name: 'Jeff Whitlock', email: 'jeff.whitlock@grain.co', color: '#C6D8F5',
    autoRecord: { label: 'All meetings', info: true },
    autoShare: { label: 'No meetings', info: true },
    recap: { label: 'No participants', info: true },
  },
  {
    id: 'ma', name: 'Mike Adams', email: 'mike@grain.co', color: '#FBE2A8',
    autoRecord: { label: 'All meetings', info: false },
    autoShare: { label: 'External participants', info: true },
    recap: { label: 'Internal participants', info: true },
  },
  {
    id: 'ja', name: 'Jake Adams', email: 'jake@grain.co', color: '#A7E6D7',
    autoRecord: { label: 'External participants', info: true },
    autoShare: { label: 'No meetings', info: false },
    recap: { label: 'Internal participants', info: false },
  },
];

function InfoVal({ label, info }: { label: string; info?: boolean }) {
  return (
    <span className="oa-infoval">
      {label}
      {info && <Icon name="info" size={14} className="oa-infoval__i" />}
    </span>
  );
}

function TeamMembersSection() {
  return (
    <>
      <div className="set-card oa-team-block">
        <div className="oa-block-head">
          <div className="oa-block-head__text">
            <h2 className="oa-block-title">Members</h2>
            <p className="oa-block-sub">Can view and auto-share meetings with this team</p>
          </div>
          <button type="button" className="oa-btn-green">
            <Icon name="plus" size={15} /> <span>Add members</span>
          </button>
        </div>

        <div className="oa-block-divider" />

        <div className="oa-members-controls">
          <div className="oa-filter">
            <input type="text" placeholder="Filter by name or email" aria-label="Filter by name or email" />
          </div>
        </div>

        <div className="oa-mtable" role="table">
          <div className="oa-mtable__head" role="row">
            <span role="columnheader">Name</span>
            <span role="columnheader">Auto-record setting</span>
            <span role="columnheader">Team auto-share setting</span>
            <span role="columnheader">Recap email setting</span>
          </div>
          {TEAM_MEMBERS.map((m) => (
            <div className="oa-mtable__row" role="row" key={m.id}>
              <span className="oa-mcell oa-mcell--name" role="cell">
                <span className="oa-mname">{m.name}</span>
                <span className="oa-memail">{m.email}</span>
              </span>
              <span className="oa-mcell" role="cell"><InfoVal {...m.autoRecord} /></span>
              <span className="oa-mcell" role="cell"><InfoVal {...m.autoShare} /></span>
              <span className="oa-mcell" role="cell"><InfoVal {...m.recap} /></span>
            </div>
          ))}
        </div>
      </div>

      <div className="set-card oa-team-block">
        <div className="oa-block-head">
          <div className="oa-block-head__text">
            <h2 className="oa-block-title">Subscribers</h2>
            <p className="oa-block-sub">Can view this team's meetings · <em>Only admins can add subscribers to private teams.</em></p>
          </div>
          <div className="oa-sub-actions">
            <div className="oa-avstack" aria-hidden="true">
              <span className="oa-av" style={{ background: '#F2C2D5' }}>RW</span>
              <span className="oa-av" style={{ background: '#FFD1B3' }}>SM</span>
            </div>
            <button type="button" className="oa-btn-neutral"><Icon name="plus" size={15} /> <span>Add subscribers</span></button>
          </div>
        </div>
      </div>
    </>
  );
}

// Renders the SAME component as Organization admin → Meetings settings, in
// embed mode (no page header), scoped to team wording.
function TeamDefaultsSection() {
  return (
    <div className="oa-team-defaults">
      <div className="oa-defaults-head">
        <h2 className="oa-block-title">Team default settings</h2>
        <p className="oa-block-sub">Set the default capture and sharing settings for team members</p>
      </div>
      <OrgAdminMyMeetings orgAdmin embed scope="team" showArtboard={false} />
    </div>
  );
}

export function OrgAdminTeam({ team }: { team?: OrgTeam }) {
  const t = team;
  const [name, setName] = useState(t?.label || '');
  useEffect(() => { setName(t?.label || ''); }, [t?.id]);
  const members = t?.members || 0;

  return (
    <div>
      <div className="oa-crumb"><Icon name="chevLeft" size={15} /> {t?.label}</div>

      <div className="set-page">
        <header className="set-page__head">
          <h1 className="set-page__title">{t?.label}</h1>
          <p className="set-page__sub">{members} team {members === 1 ? 'member' : 'members'}</p>
        </header>

        <div className="set-card oa-team-card">
          <div className="oa-card-title">Icon &amp; name</div>
          <div className="oa-ws-name">
            <span className="oa-ws-name__logo" style={{ color: t?.iconColor }} aria-hidden="true">
              <Icon name={t?.icon || 'globe'} size={16} />
            </span>
            <input className="oa-input" value={name} onChange={(e) => setName(e.target.value)} aria-label="Team name" />
          </div>
        </div>

        <TeamMembersSection />

        <TeamDefaultsSection />

        <div className="oa-delete-row">
          <div className="oa-delete-row__text">
            <p className="oa-delete-row__title">Delete Team</p>
            <p className="oa-delete-row__desc">Meetings will remain available to owners and anyone with explicit access.</p>
          </div>
          <button type="button" className="oa-btn-neutral">Delete</button>
        </div>
      </div>
    </div>
  );
}
