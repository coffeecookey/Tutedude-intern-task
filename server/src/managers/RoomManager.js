const { getPlayer } = require('./WorldStateManager');

const activeRooms = new Map(); // roomId → Set<userId>
const userRoom    = new Map(); // userId → roomId

const _socketJoin  = (io, uid, roomId) => { const s = getPlayer(uid)?.socketId; if (s && io) io.sockets.sockets.get(s)?.join(roomId); };
const _socketLeave = (io, uid, roomId) => { const s = getPlayer(uid)?.socketId; if (s && io) io.sockets.sockets.get(s)?.leave(roomId); };

const stableRoomId = (memberArr) => [...memberArr].sort().join('-');

const joinRoom = (io, memberArr) => {
  const roomId = stableRoomId(memberArr);
  if (!activeRooms.has(roomId)) activeRooms.set(roomId, new Set());
  const room = activeRooms.get(roomId);
  memberArr.forEach(uid => {
    const existing = userRoom.get(uid);
    if (existing && existing !== roomId) leaveRoom(io, uid, existing);
    if (room.has(uid)) return;
    userRoom.set(uid, roomId);
    room.add(uid);
    _socketJoin(io, uid, roomId);
  });
  return roomId;
};

const leaveRoom = (io, userId, roomId) => {
  userRoom.delete(userId);
  const room = activeRooms.get(roomId);
  if (!room) return;
  room.delete(userId);
  _socketLeave(io, userId, roomId);
  if (room.size === 0) activeRooms.delete(roomId);
  // history intentionally NOT cleared
};

const getRoomForUser = (userId)  => userRoom.get(userId) || null;
const getActiveRooms = ()        => [...activeRooms.entries()].map(([roomId, s]) => ({ roomId, members: [...s] }));
const getUsersInRoom = (roomId)  => [...(activeRooms.get(roomId) || [])];
const clearUser      = (userId)  => { const r = userRoom.get(userId); if (r) leaveRoom(null, userId, r); };

module.exports = { joinRoom, leaveRoom, getRoomForUser, clearUser, getActiveRooms, getUsersInRoom, stableRoomId };
