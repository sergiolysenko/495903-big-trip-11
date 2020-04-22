import {formatMonth, createElement} from "./utils.js";

const createTripDay = (tripDay) => {
  const {day, month, year, dayNumber /* , events */} = tripDay;

  return (`<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="${year}-${month}-${day}">${formatMonth(month)} ${day}</time>
      </div>
      <ul class="trip-events__list">
        
      </ul>
    </li>
  `);
};


export class TripDayComponent {
  constructor(tripDay) {
    this._tripDay = tripDay;
    this._element = null;
  }
  getTemplate() {
    return createTripDay(this._tripDay);
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
