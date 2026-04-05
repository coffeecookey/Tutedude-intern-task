const { broadcastMessage } = require('../managers/ChatManager');
const { getRoomForUser } = require('../managers/RoomManager');
const { getPlayer } = require('../managers/WorldStateManager');

const lastMessageTime = new Map();

const registerChatHandler = (socket, io, socketToUser) => {
  socket.on('chat:message', ({ text }) => {
    const userId = socketToUser.get(socket.id);
    if (!userId) return console.warn('[Chat] unknown user -', socket.id);

    if (!text || typeof text !== 'string' || text.trim().length === 0)
      return console.warn('[Chat] invalid text -', userId);

    if (text.length > 500)
      return console.warn('[Chat] too long -', userId);

    const now = Date.now();
    if (now - (lastMessageTime.get(userId) || 0) < 500)
      return console.warn('[Chat] rate limited -', userId);

    const roomId = getRoomForUser(userId);
    if (!roomId) return console.warn('[Chat] no active room -', userId);

    lastMessageTime.set(userId, now);
    const player = getPlayer(userId);
    broadcastMessage(io, roomId, userId, player?.name || 'Unknown', text.trim());
  });

  socket.on('disconnect', () => {
    const userId = socketToUser.get(socket.id);
    if (userId) lastMessageTime.delete(userId);
  });
};

module.exports = { registerChatHandler };
