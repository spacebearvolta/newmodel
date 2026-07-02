import { Icon } from '../primitives/Icon';

export function Replay({ onClick, label = 'Replay' }: { onClick?: () => void; label?: string }) {
  return (
    <button className="replay" onClick={onClick}>
      <Icon name="refresh" /> {label}
    </button>
  );
}
