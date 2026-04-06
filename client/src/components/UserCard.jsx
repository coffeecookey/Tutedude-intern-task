import useGameStore from '../state/useGameStore';
import t from '../theme';

export default function UserCard({ userId, onClose }) {
  const player = useGameStore((s) => s.remotePlayers.get(userId));
  const status = useGameStore((s) => s.playerStatuses.get(userId) || 'online');
  if (!player) return null;

  return (
    <div className="absolute left-full top-0 ml-1 w-44 rounded p-3 text-xs z-50"
      style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}>
      <div className="font-bold mb-1">{player.name}</div>
      <div className="flex items-center gap-1" style={{ color: t.textMuted }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: status === 'afk' ? t.statusAfk : t.statusOnline, display: 'inline-block' }} />
        {status}
      </div>
      <button className="mt-2 text-xs" style={{ color: t.textMuted }} onClick={onClose}>close</button>
    </div>
  );
}
