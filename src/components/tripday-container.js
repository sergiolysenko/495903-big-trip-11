import {formatMonth} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createTripDay = (tripDay) => {
  const {day, month, year, dayNumber} = tripDay || {};
  const isTripDaysSortByEvents = !!tripDay;

  return (`<li class="trip-days__item  day">
      <div class="day__info">
      ${isTripDaysSortByEvents ?
      `<span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="${year}-${month}-${day}">${formatMonth(month)} ${day}</time>`
      : ``
    }
      </div>
      <ul class="trip-events__list">
        
      </ul>
    </li>
  `);
};


export default class TripDayComponent extends AbstractComponent {
  constructor(tripDay) {
    super();
    this._tripDay = tripDay;
  }
  getTemplate() {
    return createTripDay(this._tripDay);
  }
}

