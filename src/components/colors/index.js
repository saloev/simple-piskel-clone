import { MDCList } from '@material/list';

import { LSAPI, Event } from '../../js/utils/index';

/**
 * @classdesc Change colors tools for Canvas
 * @class
 */
export default class Colors {
  constructor(selector, colorPickerSelector) {
    this.list = new MDCList(document.querySelector(`${selector}`));
    this.colorPicker = document.querySelector(`${colorPickerSelector}`);

    if (!this.list) {
      throw Error(`List not found by querySelector ${selector}`);
    }

    if (!this.colorPicker) {
      throw Error(`color picker not found by querySelector ${colorPickerSelector}`);
    }
  }

  init() {
    this.list.singleSelection = true;

    this.addEvents();

    this.colors = {};

    this.checkLocalStorage();
  }

  /**
   *
   */
  checkLocalStorage() {
    const colors = LSAPI.getItem('colors');

    if (colors) {
      this.setStyleFromLocalStorage(colors);
    } else {
      this.getComputedColors();
    }
  }

  /**
   *
   */
  getComputedColors() {
    const styles = getComputedStyle(document.documentElement);

    this.colors = {
      current: styles.getPropertyValue('--current-color'),
      previous: styles.getPropertyValue('--previous-color'),
      'default-first': styles.getPropertyValue('--default-first-color'),
      'default-second': styles.getPropertyValue('--default-second-color'),
    };

    this.saveColorsToLocalStorage();
  }

  /**
   *
   * @param {*} value
   */
  setStyleFromLocalStorage(value) {
    const colors = value;

    // eslint-disable-next-line
    Object.keys(colors).map((key) => {
      const color = colors[key];

      this.colors[key] = color;
      this.setColor(key, color);
    });
  }

  /**
   * Save colors to localStorage
   */
  saveColorsToLocalStorage() {
    LSAPI.setItem('colors', this.colors);
  }

  /**
   * Change css variable colors and @call @method saveColorsToLocalStorage
   * @param {*} type
   * @param {*} color
   */
  setColor(type, color) {
    this.colors[type] = color;
    document.documentElement.style.setProperty(`--${type}-color`, color);

    this.saveColorsToLocalStorage();
  }

  /**
   *
   * @param {String} color
   */
  toggleCurrentAndPreviousColors = (color) => {
    this.setColor('previous', this.colors.current);
    this.setColor('current', color);
  }

  /**
   *
   * @param {EventObject} e
   */
  colorPicked = (e) => {
    const { detail: { index } } = e;

    // TODO rewrite to better solution (not depends on HTML order)
    // !!! order in html is important @see /html/colors.html
    const dispatchColors = {
      0: 'current',
      1: 'previous',
      2: 'default-first',
      3: 'default-second',
    };
    const colorType = dispatchColors[index];
    const color = this.colors[colorType];

    this.toggleCurrentAndPreviousColors(color);
  }

  /**
   * Trigger when color picker change
   * and @call @method toggleCurrentAndPreviousColors which change current and previous colors
   * @param {EventObject} e
   */
  colorPickerChange = (e) => {
    const { target: { value } } = e;

    this.toggleCurrentAndPreviousColors(value);
  }

  /**
   *
   * @param {EventObject} e
   */
  currentColorChange = ({ detail: { data } }) => {
    this.setColor('current', data);
  }

  /**
   * keyboard shortcuts
   */
  colorActionShortcuts = ({ key }) => {
    const dispatchColors = {
      1: 'previous',
      2: 'default-first',
      3: 'default-second',
    };

    const colorType = dispatchColors[key];
    if (!colorType) return;

    const color = this.colors[colorType];

    this.toggleCurrentAndPreviousColors(color);
  }

  addEvents() {
    // color list clicked
    this.list.listen('MDCList:action', this.colorPicked);
    // color picker change
    // this.colorPicker.addEventListener('change', this.colorPickerChange);
    Event.listen('change', this.colorPickerChange, this.colorPicker);
    // Current color change in @class Canvas.js
    Event.listen('currentColor:change', this.currentColorChange);
    Event.listen('keydown', this.colorActionShortcuts);
  }
}
