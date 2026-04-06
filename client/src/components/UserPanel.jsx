import { useState } from 'react';
import useGameStore from '../state/useGameStore';
import UserCard from './UserCard';
import t from '../theme';

export default function UserPanel() {
  const remotePlayers  = useGameStore((s) => s.remotePlayers);
  const playerStatuses = useGameStore((s) => s.playerStatuses);
  const localPlayer    = useGameStore((s) => s.localPlayer);
  const [selected, setSelected] = useState(null);

  return (
    <div className="fixed left-0 top-0 h-full w-48 flex flex-col text-xs"
      style={{ background: t.panelBg, borderRight: `1px solid ${t.border}` }}>
      <div className="p-2" style={{ color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>Players Online</div>

      {localPlayer && (
        <div className="flex items-center gap-2 px-3 py-1" style={{ color: t.accent }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.statusOnline, display: 'inline-block' }} />
          {localPlayer.name} (You)
        </div>
      )}

      {[...remotePlayers.entries()].map(([uid, data]) => {
        const status = playerStatuses.get(uid) || 'online';
        return (
          <div key={uid} className="relative flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-white/5"
            style={{ color: t.textPrimary }}
            onClick={() => setSelected(selected === uid ? null : uid)}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: status === 'afk' ? t.statusAfk : t.accentAlt, display: 'inline-block' }} />
            {data.name}
            {selected === uid && <UserCard userId={uid} onClose={() => setSelected(null)} />}
          </div>
        );
      })}
    </div>
  );
}
