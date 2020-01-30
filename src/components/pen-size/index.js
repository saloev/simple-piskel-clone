import { MDCSelect } from '@material/select';

import { Event, LSAPI } from '../../js/utils/index';

export default class PenSize {
  constructor(selector) {
    this.select = new MDCSelect(document.querySelector(`${selector}`));
  }

  init() {
    this.bindEvents();
    this.checkLocalStorage();
  }

  checkLocalStorage() {
    const canvasInfo = LSAPI.getItem('canvasInfo');
    if (!canvasInfo) return;

    const { penSize } = canvasInfo;
    if (!penSize) return;

    this.select.value = +penSize;
    this.select.selectedIndex = penSize - 1;
  }

  bindEvents() {
    this.select.listen('MDCSelect:change', () => {
      Event.create('penSize:change', this.select.value);
    });
  }
}
