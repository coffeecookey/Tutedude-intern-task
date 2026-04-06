const messageHistory = new Map();
const MAX_ROOMS      = 100;
let messageCounter   = 0;

const broadcastMessage = (io, roomId, userId, userName, text) => {
  messageCounter++;
  const msg = { id: messageCounter, from: userId, name: userName, text, timestamp: Date.now() };
  if (!messageHistory.has(roomId)) {
    if (messageHistory.size >= MAX_ROOMS) {
      const oldest = messageHistory.keys().next().value;
      messageHistory.delete(oldest);
    }
    messageHistory.set(roomId, []);
  }
  const history = messageHistory.get(roomId);
  history.push(msg);
  if (history.length > 50) history.shift();
  io.to(roomId).emit('chat:message', { roomId, ...msg });
};

const getHistory     = (roomId) => messageHistory.get(roomId) || [];
const copyHistory    = (fromId, toId) => { const h = messageHistory.get(fromId); if (h?.length) messageHistory.set(toId, [...h]); };
const clearHistory   = () => {};

module.exports = { broadcastMessage, getHistory, copyHistory, clearHistory };
