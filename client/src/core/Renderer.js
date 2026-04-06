import * as PIXI from 'pixi.js';
import theme from '../theme';

let app = null;
let _resizeHandler = null;

const initRenderer = (canvasEl) => {
  app = new PIXI.Application({
    view: canvasEl,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: theme.canvasBg,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  _resizeHandler = () => app.renderer.resize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', _resizeHandler);

  return app;
};

const destroyRenderer = () => {
  if (_resizeHandler) {
    window.removeEventListener('resize', _resizeHandler);
    _resizeHandler = null;
  }
  app = null;
};

const getApp = () => app;
const getStage = () => app?.stage;
export { initRenderer, destroyRenderer, getApp, getStage };
