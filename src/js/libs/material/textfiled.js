import { MDCTextField } from '@material/textfield';

export default () => {
  // eslint-disable-next-line
  const textfiled = new MDCTextField(document.querySelector('.mdc-text-field'));
  // eslint-disable-next-line
  const textfiledCanvasSize = new MDCTextField(document.querySelector('.canvas__input-size'));
};
