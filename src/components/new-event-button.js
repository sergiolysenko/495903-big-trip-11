export default class NewEventButtonComponent {
  constructor() {
    this._newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    this._onClickHandlers = [];
    this.onNewEventClick();
  }

  toggleDisabledNewEvent() {
    this._newEventButton.disabled = !this._newEventButton.disabled;
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
