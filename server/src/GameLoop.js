const { getAll } = require('./managers/WorldStateManager');
const { TICK_RATE } = require('./config/constants');

let tick = 0;
let interval = null;

const startGameLoop = (io) => {
  interval = setInterval(() => {
    tick++;
    const players = getAll();
    if (Object.keys(players).length === 0) return;
    io.emit('world:state', { tick, players });
  }, TICK_RATE);
};

const stopGameLoop = () => {
  clearInterval(interval);
  tick = 0;
};

module.exports = { startGameLoop, stopGameLoop };
