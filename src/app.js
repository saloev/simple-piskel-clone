import './scss/main.scss';

import libs from './js/libs/material/index';
import components from './components/index';

const init = () => {
  components();

  // load libs
  libs();
};

window.addEventListener('DOMContentLoaded', init);
