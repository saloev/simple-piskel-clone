
import { LSAPI } from '../js/utils/index';

import Canvas from './canvas/index';
import CanvasSize from './canvas-size/index';
import Colors from './colors/index';
import LoadImage from './image-loader/index';
import Tools from './tools/index';
import PenSize from './pen-size/index';


export default () => {
  const colorsTools = new Colors('.mdc-list--colors', '.color-picker__input');
  colorsTools.init();
  const tools = new Tools('.mdc-list--tools');
  tools.init();

  const loadImage = new LoadImage('.btn--load-img');
  loadImage.init();

  const slider = new CanvasSize('.mdc-slider', '.btn--change-canvas-size');
  slider.init();

  const pen = new PenSize('.mdc-select');
  pen.init();

  const canvas = new Canvas('#canvas');
  canvas.init();

  // save to local storage when user try to close tab
  window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    // eslint-disable-next-line no-param-reassign
    event.returnValue = '';

    // save data to local storage
    // canvas data
    const canvasInfo = {
      tool: canvas.tool,
      dataURL: canvas.canvas.toDataURL(),
      matrixSize: canvas.matrixSize,
      pixelSize: canvas.pixelSize,
      penSize: canvas.penSize,
    };

    LSAPI.setItem('canvasInfo', canvasInfo);
  });
};
