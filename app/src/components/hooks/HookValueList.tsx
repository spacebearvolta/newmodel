import { Icon } from '../primitives/Icon';

export interface ValuePoint {
  icon: string;
  label: string;
}

export const HOOK_VALUE_POINTS: ValuePoint[] = [
  { icon: 'infinity', label: 'No 45-minute recording cap' },
  { icon: 'history', label: 'Unlimited meeting history' },
  { icon: 'users', label: 'A shared library your whole team can search' },
  { icon: 'terminal', label: 'Integrations & API — HubSpot, Salesforce, Slack' },
];

export function HookValueList({ points = HOOK_VALUE_POINTS }: { points?: ValuePoint[] }) {
  return (
    <ul className="hook-values">
      {points.map((p) => (
        <li key={p.label} className="hook-values__item">
          <span className="hook-values__icon">
            <Icon name={p.icon} size={15} />
          </span>
          <span>{p.label}</span>
        </li>
      ))}
    </ul>
  );
}
