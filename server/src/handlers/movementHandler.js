const { updatePlayer, getPlayer } = require('../managers/WorldStateManager');
const { MAP_BOUNDS, MAX_SPEED } = require('../config/constants');

const lastMoveTime = new Map();
const SPEED_THRESHOLD_SQ = (MAX_SPEED * 2) ** 2;

const registerMovementHandler = (socket, socketToUser) => {
  socket.on('player:move', ({ x, y }) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    const now = Date.now();
    if (now - (lastMoveTime.get(socket.id) || 0) < 30) return;

    const userId = socketToUser.get(socket.id);
    if (!userId) return;

    const player = getPlayer(userId);
    if (!player) return;

    const dx = x - player.x;
    const dy = y - player.y;
    const distSq = dx * dx + dy * dy;

    if (distSq > SPEED_THRESHOLD_SQ) {
      console.warn(`Suspicious move from ${userId}: distance²=${distSq}`);
      return;
    }

    lastMoveTime.set(socket.id, now);
    updatePlayer(userId, Math.min(Math.max(x, 0), MAP_BOUNDS.width), Math.min(Math.max(y, 0), MAP_BOUNDS.height));
  });

  socket.on('disconnect', () => lastMoveTime.delete(socket.id));
};

module.exports = { registerMovementHandler };
