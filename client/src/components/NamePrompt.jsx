import { useState } from 'react';
import t from '../theme';

export default function NamePrompt({ onSubmit }) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    if (submitting) return;
    const n = name.trim();
    if (!n) return;
    setSubmitting(true);
    onSubmit(n);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: t.bg, color: t.textPrimary }}>
      <h1 className="text-2xl font-bold" style={{ color: t.accent }}>Virtual Cosmos</h1>
      <input
        className="px-4 py-2 rounded outline-none text-sm w-64"
        style={{ background: t.surface, color: t.textPrimary, border: `1px solid ${t.border}` }}
        placeholder="Enter your name..."
        maxLength={20}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.isComposing) return; if (e.key === 'Enter') submit(); }}
        autoFocus
      />
      <button
        className="px-6 py-2 rounded text-sm"
        style={{ background: t.border, color: t.textPrimary, opacity: name.trim() && !submitting ? 1 : 0.5 }}
        disabled={!name.trim() || submitting}
        onClick={submit}
      >{submitting ? 'Joining...' : 'Enter'}</button>
    </div>
  );
}
