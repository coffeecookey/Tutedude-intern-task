import GameCanvas from './components/GameCanvas';
import ChatPanel from './components/ChatPanel';

export default function App() {
  return (
    <>
      <GameCanvas playerName="TestPlayer" />
      <ChatPanel />
    </>
  );
}
