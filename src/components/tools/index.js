import { MDCList } from '@material/list';

//
import { LSAPI, Event } from '../../js/utils/index';

export default class Tools {
  constructor(selector) {
    this.domList = document.querySelector(`${selector}`);
    this.list = new MDCList(this.domList);
    if (!this.list) {
      throw Error('List not found by querySelector');
    }
  }

  init() {
    this.list.singleSelection = true;
    this.tool = 'paint';

    this.checkLocalStorage();
    this.bindEvents();
  }

  checkLocalStorage() {
    const canvasInfo = LSAPI.getItem('canvasInfo');
    if (!canvasInfo) return;

    const { tool } = canvasInfo;
    this.tool = tool;
    this.toggleActiveClass();
  }

  /**
   *
   * @param {String} eventName
   * @param {Object} data
   */
  // eslint-disable-next-line class-methods-use-this
  dispatchCustomEvent(toolName) {
    Event.create('tool:change', toolName);
  }

  changeTool() {
    this.dispatchCustomEvent(this.tool);
  }

  toggleActiveClass() {
    const dispatchToolName = {
      fill: 1,
      colorPicker: 2,
      paint: 3,
      clear: 4,
      stroke: 5,
      eraser: 6,
    };

    const toolIndex = dispatchToolName[this.tool];
    if (!toolIndex) return;

    const selectedList = this.domList.querySelector('li.mdc-list-item--selected');

    if (selectedList) {
      selectedList.classList.remove('mdc-list-item--selected');
    }

    this.newSelectedList = this.domList.querySelector(`ul>li:nth-child(${toolIndex})`);
    this.newSelectedList.classList.add('mdc-list-item--selected');
  }

  // TODO rewrite to better solution (not depends on HTML order)
  // !!! order in html is important @see /html/colors.html
  toolsAction = (e) => {
    const { detail: { index } } = e;

    const dispatchEvents = {
      0: 'fill',
      1: 'colorPicker',
      2: 'paint',
      3: 'clear',
      4: 'stroke',
      5: 'eraser',
    };

    this.tool = dispatchEvents[index];

    this.changeTool();
    this.toggleActiveClass();
  };

  /**
   * keyboard shortcuts
   */
  toolsActionShortcuts = ({ key }) => {
    const dispatchEvents = {
      f: 'fill',
      g: 'colorPicker',
      p: 'paint',
      c: 'clear',
      s: 'stroke',
      e: 'eraser',
    };

    const toolName = dispatchEvents[key.toLowerCase()];
    if (!toolName) return;

    this.tool = toolName;
    this.toggleActiveClass();
    this.changeTool();
  }

  bindEvents() {
    this.list.listen('MDCList:action', this.toolsAction);
    Event.listen('keydown', this.toolsActionShortcuts);
  }
}
