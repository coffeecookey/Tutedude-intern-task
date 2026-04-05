import { useState, useEffect, useRef } from 'react';
import useGameStore from '../state/useGameStore';
import { emitChatMessage } from '../network/SocketClient';

const fmt = (ts) => new Date(ts).toTimeString().slice(0, 5);

export default function ChatPanel() {
  const { chatMessages, activeChatRoom, clearChatMessages } = useGameStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    clearChatMessages();
  }, [activeChatRoom]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!activeChatRoom) return null;

  const send = () => {
    const text = input.trim();
    if (!text) return;
    emitChatMessage(activeChatRoom, text);
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const charsLeft = 500 - input.length;

  return (
    <div className="fixed right-0 top-0 h-full w-72 flex flex-col" style={{ background: 'rgba(10,10,26,0.9)', borderLeft: '1px solid #3344aa' }}>
      <div className="p-2 text-xs" style={{ color: '#8899ff', borderBottom: '1px solid #3344aa' }}>Nearby Chat</div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {chatMessages.map((msg, i) => (
          <div key={`${msg.timestamp}-${msg.from}-${i}`} className="text-xs" style={{ color: '#ccc' }}>
            <span style={{ color: '#8899ff' }}>{msg.name || msg.from.slice(0, 6)}: </span>
            {msg.text}
            <span className="ml-1" style={{ color: '#667', fontSize: 10 }}>{fmt(msg.timestamp)}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex flex-col p-2 gap-1" style={{ borderTop: '1px solid #3344aa' }}>
        {input.length > 400 && <div className="text-xs text-right" style={{ color: charsLeft < 50 ? '#ff6b6b' : '#667' }}>{charsLeft}</div>}
        <div className="flex gap-1">
          <input
            className="flex-1 text-xs px-2 py-1 rounded outline-none"
            style={{ background: '#111133', color: '#fff', border: '1px solid #3344aa' }}
            value={input}
            maxLength={500}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Say something..."
          />
          <button
            className="text-xs px-2 py-1 rounded"
            style={{ background: '#3344aa', color: '#fff', opacity: input.trim() ? 1 : 0.5 }}
            disabled={!input.trim()}
            onClick={send}
          >Send</button>
        </div>
      </div>
    </div>
  );
}
