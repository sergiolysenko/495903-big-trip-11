export default class NewEventButtonComponent {
  constructor() {
    this._newEventButton = document.querySelector(`.trip-main__event-add-btn`);
  }

  toggleDisabledNewEvent() {
    if (this._newEventButton.disabled === true) {
      this._newEventButton.disabled = false;
    } else {
      this._newEventButton.disabled = true;
    }
  }

  setOnClick(handler) {
    this._newEventButton.addEventListener(`click`, () => {
      handler();
    });
  }
}
