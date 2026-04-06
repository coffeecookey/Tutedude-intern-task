let _stage = null;
let _x = 0;
let _y = 0;
let _resizeHandler = null;

const applyCamera = (stage, x, y) => {
  _stage = stage;
  _x = x;
  _y = y;
  stage.x = window.innerWidth / 2 - x;
  stage.y = window.innerHeight / 2 - y;

  if (!_resizeHandler) {
    _resizeHandler = () => {
      if (_stage) {
        _stage.x = window.innerWidth / 2 - _x;
        _stage.y = window.innerHeight / 2 - _y;
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
