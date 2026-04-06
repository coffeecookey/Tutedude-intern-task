import { useEffect, useRef } from 'react';
import useGameStore from '../state/useGameStore';
import t from '../theme';

export default function LocationBar() {
  const currentRoom = useGameStore((s) => s.currentRoom);
  const coordsRef   = useRef(null);

  useEffect(() => {
    return useGameStore.subscribe((s) => {
      const { x, y } = s.localCoords;
      if (coordsRef.current)
        coordsRef.current.textContent = `${Math.round(x)}, ${Math.round(y)}`;
    });
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 py-1 text-xs flex items-center gap-4"
      style={{ background: t.panelBg, borderTop: `1px solid ${t.border}`, color: t.textMuted }}>
      📍 {currentRoom ? `Room: ${currentRoom}` : 'Outside'}
      <span ref={coordsRef} style={{ color: t.textDim }}>0, 0</span>
    </div>
  );
}
