import { MDCSlider } from '@material/slider';

import { LSAPI, Event } from '../../js/utils/index';

export default class SetCanvasSize {
  constructor(sliderSelector, btnSelector) {
    const slider = new MDCSlider(document.querySelector(`${sliderSelector}`));
    const button = document.querySelector(`${btnSelector}`);
    if (!slider || !button) {
      throw Error('element not found by selector');
    }

    this.slider = slider;
    this.btn = button;
  }

  init() {
    this.slider.listen('MDCSlider:change', this.sliderChange);
    this.slider.listen('MDCSlider:input', this.sliderInput);
    this.currentValue = this.slider.value;

    Event.listen('click', this.changeSize, this.btn);

    this.checkLocalStorage();
  }

  checkLocalStorage() {
    const canvasInfo = LSAPI.getItem('canvasInfo');
    if (!canvasInfo) return;

    const { matrixSize } = canvasInfo;
    this.slider.value = matrixSize;
  }

  changeSize = () => {
    const input = document.body.querySelector('.canvas-size-input');
    let { value } = input;
    const canvasMaxSize = 512;
    const canvasMinSize = 32;
    if (!+value) return;

    value = value < canvasMinSize ? canvasMinSize : value;
    value = value > canvasMaxSize ? canvasMaxSize : value;
    input.value = value;

    this.slider.value = +value;
    this.sliderChange();
  }

  sliderChange = () => {
    Event.create('canvas:changeSize', this.slider.value);
  }

  sliderInput = (e) => {
    this.slider.step = this.slider.value;

    if (e.detail.value === this.currentValue) return;

    Event.create('canvas:inputSlider', e.detail.value);
    this.currentValue = e.detail.value;
  }
}
