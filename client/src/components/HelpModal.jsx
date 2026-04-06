import { useState, useEffect } from 'react';
import t from '../theme';

function Row({ k, v }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: t.textMuted }}>{k}</span>
      <span style={{ color: t.textPrimary }}>{v}</span>
    </div>
  );
}

export default function HelpModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      <button className="fixed top-3 right-3 w-7 h-7 rounded-full text-xs font-bold z-50"
        style={{ background: t.border, color: t.textPrimary }}
        aria-label="Help"
        onClick={() => setOpen(true)}>?</button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: t.overlay }}
          role="dialog" aria-modal="true"
          onClick={() => setOpen(false)}>
          <div className="p-6 rounded text-sm w-80"
            style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textPrimary }}
            onClick={(e) => e.stopPropagation()}>
            <div className="text-base font-bold mb-4" style={{ color: t.accent }}>Controls</div>
            <div className="flex flex-col gap-2">
              <Row k="W / ↑" v="Move up" />
              <Row k="S / ↓" v="Move down" />
              <Row k="A / ←" v="Move left" />
              <Row k="D / →" v="Move right" />
              <Row k="Proximity" v="Walk near a player to chat" />
            </div>
            <button className="mt-4 text-xs" style={{ color: t.textMuted }} onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
