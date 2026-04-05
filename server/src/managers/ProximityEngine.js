// ProximityEngine: runs every 100ms to determine which players are close enough to interact

const { getAll } = require('./WorldStateManager');
const { joinRoom, leaveRoom } = require('./RoomManager');
const mapData = require('../world/mapData');

// distance thresholds (squared for efficiency) - 150px to connect, 195px to disconnect (hysteresis to prevent flickering)
// these values can be tweaked based on testing to find the sweet spot for interaction range and stability
const CONNECT_DIST_SQ    = 150 ** 2;
const DISCONNECT_DIST_SQ = 195 ** 2;

// We maintain a set of currently connected pairs and groups to manage room membership and events
const prevPairs  = new Set();
let   prevGroups = {};
// pairKey creates a consistent string key for a pair of user IDs, ensuring the smaller ID comes first to avoid duplicates like "A:B" and "B:A".
const pairKey = (a, b) => (a < b ? `${a}:${b}` : `${b}:${a}`);

// We use a union-find (disjoint set) structure to efficiently group players into proximity-based rooms. 
// Each player starts in their own set, and we union sets when players are close enough.
const find = (parent, x) => {
  // path compression optimization: we flatten the structure of the tree whenever we find a root, which speeds up future find operations.
  if (parent[x] !== x) parent[x] = find(parent, parent[x]);
  return parent[x];
};

// The union function merges the sets of two players based on their ranks to keep the tree flat, which optimizes the find operation.
const union = (parent, rank, a, b) => {
  const ra = find(parent, a), rb = find(parent, b);
  if (ra === rb) return;
  if (rank[ra] < rank[rb]) parent[ra] = rb;
  else if (rank[ra] > rank[rb]) parent[rb] = ra;
  else { parent[rb] = ra; rank[ra]++; }
};

// getRoomId checks which predefined room (from mapData) a player is currently in based on their coordinates, which can be used for location-based features or events.
const getRoomId = (x, y) => {
  const room = mapData.find(r => x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height);
  return room ? room.id : null;
};

// runProximity is the main function that executes every 100ms to check player proximities, 
// manage room memberships, and emit events for interactions and location updates.
const runProximity = (io) => {
  const allPlayers = getAll();

  // We filter out players that don't have valid positions or socket IDs to ensure we only process active players in the proximity calculations.
  const ids = Object.keys(allPlayers).filter(id => {
    const p = allPlayers[id];
    return p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.socketId;
  });

  // If there are fewer than 2 players, we can skip the proximity checks since interactions require at least 2 participants.
  if (ids.length < 2) return;

  // We initialize the union-find structure for the current set of players. 
  // Each player starts as their own parent (representing their own group) and has an initial rank of 0.
  const parent = {}, rank = {};
  ids.forEach(id => { parent[id] = id; rank[id] = 0; });

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i], b = ids[j];
      const pa = allPlayers[a], pb = allPlayers[b];
      if (!pa || !pb) continue;

      const key = pairKey(a, b);
      const dx = pa.x - pb.x;
      const dy = pa.y - pb.y;
      const distSq = dx * dx + dy * dy;
      const wasConnected = prevPairs.has(key);
      const threshold = wasConnected ? DISCONNECT_DIST_SQ : CONNECT_DIST_SQ;

      if (distSq < threshold) {
        union(parent, rank, a, b);
        if (!wasConnected) prevPairs.add(key);
      } else if (wasConnected) {
        prevPairs.delete(key);
      }
    }
  }

  const currentGroups = {};
  ids.forEach(id => {
    const root = find(parent, id);
    if (!currentGroups[root]) currentGroups[root] = new Set();
    currentGroups[root].add(id);
  });

  // cleanup dissolved groups
  for (const [groupId, members] of Object.entries(prevGroups)) {
    members.forEach(uid => {
      const inCurrent = currentGroups[groupId]?.has(uid);
      if (!inCurrent) {
        leaveRoom(io, uid, groupId);
        const s = allPlayers[uid]?.socketId;
        if (s) io.to(s).emit('interact:end');
      }
    });
  }

  // join & notify only new/changed groups
  for (const [groupId, members] of Object.entries(currentGroups)) {
    if (members.size < 2) continue;
    const memberArr = [...members];
    joinRoom(io, groupId, memberArr);
    const prev = prevGroups[groupId];
    memberArr.forEach(uid => {
      if (!prev || !prev.has(uid)) {
        const s = allPlayers[uid]?.socketId;
        if (s) io.to(s).emit('interact:start', { roomId: groupId, members: memberArr });
      }
    });
  }

  prevGroups = currentGroups;

  // location updates
  ids.forEach(uid => {
    const p = allPlayers[uid];
    if (!p) return;
    io.to(p.socketId).emit('location:update', { userId: uid, room: getRoomId(p.x, p.y) });
  });
};

module.exports = { runProximity };
