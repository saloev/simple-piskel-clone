import { LSAPI, Event } from '../../js/utils/index';

/**
 * Create canvas matrix and scale it up
 * @class
 */
export default class Canvas {
  #isPainting = false;

  constructor(canvasSelector, canvasSize = 512, defaultTool = 'paint', matrixSize = 32) {
    this.canvasSelector = canvasSelector;
    this.canvasSize = canvasSize;
    this.tool = defaultTool;
    this.matrixSize = matrixSize;
  }

  /**
   * Make context of canvas and set size
   * @throws {Error}
   */
  init() {
    this.canvas = document.querySelector(`${this.canvasSelector}`);

    if (!this.canvas) throw Error(`canvas not found by selector ${this.selector}`);
    if (!this.canvas.getContext) {
      console.error("You browser don't support context for canvas");
      return;
    }

    this.setMatrixSize();
    this.setPixelSize();
    this.ctx = this.canvas.getContext('2d');

    this.addEvents();

    this.checkLocalStorage();
  }

  setMatrixSize() {
    this.canvas.width = this.matrixSize;
    this.canvas.height = this.matrixSize;
  }

  setPixelSize() {
    this.pixelSize = Math.floor(this.canvasSize / this.matrixSize);
  }

  setPenSize = ({ detail: { data } }) => {
    this.penSize = data;
  }

  /**
   * draw image to canvas
   */
  drawImage(src = 'https://images.unsplash.com/photo-1518873247959-ccfbaecd34d9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjEwMTgwMH0') {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      const { width, height } = img;
      const max = Math.max(width, height);
      const min = Math.min(width, height);
      const ratio = max / min;
      const scale = this.matrixSize / ratio;
      const center = Math.abs(this.matrixSize - scale) / 2;

      if (max === min) {
        this.ctx.drawImage(img, 0, 0, this.matrixSize, this.matrixSize);
      } else if (max === height) {
        this.ctx.drawImage(img, center, 0, scale, this.matrixSize);
      } else {
        this.ctx.drawImage(img, 0, center, this.matrixSize, scale);
      }
    };
  }

  checkLocalStorage() {
    const canvasInfo = LSAPI.getItem('canvasInfo');
    if (!canvasInfo) return;

    const {
      tool, dataURL, pixelSize, matrixSize, penSize,
    } = canvasInfo;
    this.tool = tool;
    this.pixelSize = pixelSize || this.pixelSize;
    this.matrixSize = matrixSize || this.matrixSize;
    this.penSize = penSize || this.penSize;
    this.imageData = dataURL;
    this.setMatrixSize();

    this.drawImage(dataURL);
  }

  loadImageToCanvas = ({ detail: data }) => {
    this.clearCanvas();
    this.imageData = data.data;
    this.drawImage(this.imageData);
  }

  changeMatrixSize = ({ detail: { data } }) => {
    // this.canvasSize = data;
    this.matrixSize = data;
  }

  startPainting = (e) => {
    this.#isPainting = this.tool === 'paint' || this.tool === 'eraser';
    if (this.#isPainting) {
      this.paint(e);
    }
  }

  endPainting = () => {
    this.#isPainting = false;
    this.ctx.beginPath();
  }

  paint = (e) => {
    if (!this.#isPainting) return;

    const { offsetX, offsetY } = e;
    const x = Math.floor(offsetX / this.pixelSize);
    const y = Math.floor(offsetY / this.pixelSize);

    this.ctx.strokeStyle = this.tool === 'eraser' ? 'rgba(255, 255, 255, 1)' : this.getCurrentColor();
    this.ctx.lineWidth = this.penSize || 1;
    this.ctx.lineCap = 'square';
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  fill = () => {
    this.ctx.rect(0, 0, this.canvasSize, this.canvasSize);
    this.ctx.fillStyle = `${this.getCurrentColor()}`;
    this.ctx.fill();
  }

  pickColor = (e) => {
    const { offsetX, offsetY } = e;
    const x = Math.floor(offsetX / this.pixelSize);
    const y = Math.floor(offsetY / this.pixelSize);


    const [r, g, b, a] = this.ctx.getImageData(x, y, 1, 1).data;

    this.setCurrentColor(`rgba(${r}, ${g}, ${b}, ${a})`);
  }

  /**
   * Create Event when current color change and handle it in @class Color.js
   * @param {String} color
   */
  triggerCurrentColorEvent(color) {
    Event.create('currentColor:change', color);
  }


  getCurrentColor() {
    const { current } = LSAPI.getItem('colors');
    return current;
  }

  setCurrentColor(color) {
    this.triggerCurrentColorEvent(color);
  }

  /**
   * Clear canvas
   */
  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    this.imageData = null;
  }

  changeTool = ({ detail: { data } }) => {
    this.tool = data;
  }

  dispatchEvent = (e) => {
    const dispatch = {
      colorPicker: this.pickColor,
      fill: this.fill,
      paint: this.paint,
      clear: this.clearCanvas,
      stroke: this.paint,
      eraser: this.paint,
    };


    dispatch[this.tool](e);
  }

  saveCanvasState = () => {
    this.currentState = this.canvas.toDataURL();
  }

  changeState() {
    // reset click range
    this.clickRange = null;

    this.setMatrixSize();
    this.setPixelSize();
    if (this.imageData) {
      this.drawImage(this.imageData);
    }
  }

  changeMatrixSize = ({ detail: { data } }) => {
    this.matrixSize = data;
    this.changeState();
  }

  addEvents() {
    // events for painting
    Event.listen('mousedown', this.startPainting, this.canvas);
    Event.listen('mouseup', this.endPainting, this.canvas);
    Event.listen('mousemove', this.paint, this.canvas);

    // click on canvas
    Event.listen('click', this.dispatchEvent, this.canvas);
    // tools change
    Event.listen('tool:change', this.changeTool);
    // image load From api
    Event.listen('load:image', this.loadImageToCanvas);
    // slider size change
    Event.listen('canvas:changeSize', this.changeMatrixSize);
    // slider input (when user changing)
    Event.listen('canvas:inputSlider', this.saveCanvasState);
    // pen size changed
    Event.listen('penSize:change', this.setPenSize);
  }
}
