const keys = {};
let target = null;
let debugMode = false;

const WASD_SPEED = 4;
const CLICK_MOVE_SPEED = 12;

const initInput = () => {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyL') { debugMode = !debugMode; return; }
    keys[e.code] = true;
    clearMoveTarget();
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });
};

const setMoveTarget   = (x, y) => { target = { x, y }; };
const clearMoveTarget = ()      => { target = null; };
const isDebugMode     = ()      => debugMode;

const getVelocity = (currentX = 0, currentY = 0) => {
  if (target) {
    const dx = target.x - currentX;
    const dy = target.y - currentY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) { clearMoveTarget(); return { vx: 0, vy: 0 }; }
    return { vx: (dx / dist) * CLICK_MOVE_SPEED, vy: (dy / dist) * CLICK_MOVE_SPEED };
  }
  let vx = 0, vy = 0;
  if (keys['ArrowLeft']  || keys['KeyA']) vx -= WASD_SPEED;
  if (keys['ArrowRight'] || keys['KeyD']) vx += WASD_SPEED;
  if (keys['ArrowUp']    || keys['KeyW']) vy -= WASD_SPEED;
  if (keys['ArrowDown']  || keys['KeyS']) vy += WASD_SPEED;
  return { vx, vy };
};

export { initInput, getVelocity, setMoveTarget, clearMoveTarget, isDebugMode };
