const messageHistory = new Map();
const MAX_HISTORY = 50;
let messageCounter = 0;

const broadcastMessage = (io, roomId, userId, userName, text) => {
  messageCounter++;
  const msg = { id: messageCounter, from: userId, name: userName, text, timestamp: Date.now() };
  if (!messageHistory.has(roomId)) messageHistory.set(roomId, []);
  const history = messageHistory.get(roomId);
  history.push(msg);
  if (history.length > MAX_HISTORY) history.shift();
  io.to(roomId).emit('chat:message', { roomId, ...msg });
};

const getHistory   = (roomId) => messageHistory.get(roomId) || [];
const clearHistory = (roomId) => messageHistory.delete(roomId);

module.exports = { broadcastMessage, getHistory, clearHistory };
