import {createElement} from "./utils.js";

const createTripDaysContainer = () => {
  return (`<ul class="trip-days">
    </ul>`);
};

export class TripDaysComponent {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return createTripDaysContainer();
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
