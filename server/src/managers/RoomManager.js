const { clearHistory } = require('./ChatManager');
const activeRooms = new Map();
const userRoom    = new Map();

const joinRoom = (io, groupId, members) => {
  if (!activeRooms.has(groupId)) activeRooms.set(groupId, new Set());
  const room = activeRooms.get(groupId);
  members.forEach(uid => {
    const existing = userRoom.get(uid);
    if (existing && existing !== groupId) leaveRoom(io, uid, existing);
    if (room.has(uid)) return;
    userRoom.set(uid, groupId);
    room.add(uid);
  });
};

const leaveRoom = (io, userId, groupId) => {
  userRoom.delete(userId);
  const room = activeRooms.get(groupId);
  if (!room) return;
  room.delete(userId);
  if (room.size === 0) { activeRooms.delete(groupId); clearHistory(groupId); }
};

const getRoomForUser  = (userId)   => userRoom.get(userId) || null;
const getActiveRooms  = ()         => [...activeRooms.entries()].map(([groupId, s]) => ({ groupId, members: [...s] }));
const getUsersInRoom  = (groupId)  => [...(activeRooms.get(groupId) || [])];

const clearUser = (userId) => {
  const groupId = userRoom.get(userId);
  if (groupId) leaveRoom(null, userId, groupId);
};

module.exports = { joinRoom, leaveRoom, getRoomForUser, clearUser, getActiveRooms, getUsersInRoom };
