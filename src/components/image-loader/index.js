import { Event, fetchImage } from '../../js/utils/index';

export default class LoadImage {
  constructor(buttonSelector) {
    const button = document.querySelector(`${buttonSelector}`);
    if (!button) { throw Error(`button not found with querySelector ${buttonSelector}`); }
    this.button = button;
  }

  init() {
    Event.listen('click', this.loadImage, this.button);
  }

  loadImage = () => {
    const { value } = document.body.querySelector('.town-input');

    const checkValue = value || 'Minsk';
    fetchImage(checkValue)
      .then((res) => {
        const { urls: { small } } = res;
        Event.create('load:image', small);
      }).catch((err) => {
        console.error(err);
      });
  };
}
