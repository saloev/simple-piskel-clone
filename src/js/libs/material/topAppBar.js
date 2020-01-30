import { MDCTopAppBar } from '@material/top-app-bar';

export default () => {
  // Instantiation Top bar
  const topAppBarElement = document.querySelector('.mdc-top-app-bar');
  // eslint-disable-next-line
  const topAppBar = new MDCTopAppBar(topAppBarElement);
};
