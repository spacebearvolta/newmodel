import { useMemo } from 'react';

const AVATAR_COLORS: [string, string][] = [
  ['#16A35F', '#fff'], ['#0052B4', '#fff'], ['#9747FF', '#fff'],
  ['#EA580C', '#fff'], ['#0EA5E9', '#fff'], ['#D946EF', '#fff'],
  ['#0B6F3F', '#fff'], ['#1F2937', '#fff'],
];

interface AvatarProps {
  name?: string;
  size?: number;
}

export function Avatar({ name = '', size = 36 }: AvatarProps) {
  const initials = name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const idx = useMemo(() => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
    return Math.abs(h) % AVATAR_COLORS.length;
  }, [name]);
  const [bg, fg] = AVATAR_COLORS[idx];
  return (
    <span
      className="user-row__avatar"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.round(size * 0.4) }}
    >
      {initials || '?'}
    </span>
  );
}
