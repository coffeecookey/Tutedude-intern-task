import useGameStore from '../state/useGameStore';
import t from '../theme';

export default function LocationBar() {
  const currentRoom = useGameStore((s) => s.currentRoom);
  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 py-1 text-xs flex items-center gap-2"
      style={{ background: t.panelBg, borderTop: `1px solid ${t.border}`, color: t.textMuted }}>
      📍 {currentRoom ? `Room: ${currentRoom}` : 'Outside'}
    </div>
  );
}
