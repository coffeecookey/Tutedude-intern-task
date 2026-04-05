const applyCamera = (stage, x, y) => {
  stage.x = window.innerWidth / 2 - x;
  stage.y = window.innerHeight / 2 - y;
};

export { applyCamera };
