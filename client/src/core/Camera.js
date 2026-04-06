let _stage = null;
let _x = 0;
let _y = 0;
let _zoom = 1;
let _resizeHandler = null;

const applyCamera = (stage, x, y, zoom = 1) => {
  _stage = stage;
  _x = x;
  _y = y;
  _zoom = zoom;
  stage.scale.set(zoom);
  stage.x = window.innerWidth  / 2 - x * zoom;
  stage.y = window.innerHeight / 2 - y * zoom;

  if (!_resizeHandler) {
    _resizeHandler = () => {
      if (_stage) {
        _stage.x = window.innerWidth  / 2 - _x * _zoom;
        _stage.y = window.innerHeight / 2 - _y * _zoom;
      }
    };
    window.addEventListener('resize', _resizeHandler);
  }
};

const destroyCamera = () => {
  if (_resizeHandler) {
    window.removeEventListener('resize', _resizeHandler);
    _resizeHandler = null;
  }
  _stage = null;
};

export { applyCamera, destroyCamera };
