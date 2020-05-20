export default class NewEventButtonComponent {
  constructor() {
    this._newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    this._onClickHandlers = [];
    this.onNewEventClick();
  }

  toggleDisabledNewEvent() {
    if (this._newEventButton.disabled === true) {
      this._newEventButton.disabled = false;
    } else {
      this._newEventButton.disabled = true;
    }
  }

  setOnClickHandler(handler) {
    this._onClickHandlers.push(handler);
  }

  onNewEventClick() {
    this._newEventButton.addEventListener(`click`, () => {
      this._callHandlers(this._onClickHandlers);
    });
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

}
