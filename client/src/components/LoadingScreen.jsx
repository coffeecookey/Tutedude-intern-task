import t from '../theme';

export default function LoadingScreen() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-3"
      style={{ background: t.bg, color: t.textMuted }}>
      <div className="text-xl" style={{ color: t.accent }}>Virtual Cosmos</div>
      <div className="text-sm animate-pulse">Connecting to world...</div>
    </div>
  );
}
