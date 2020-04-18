import {formatMonth} from "./utils.js";
import {createEventItemTemplate} from "./event-item.js";

const createTripDay = (tripDay) => {
  const {day, month, year, dayNumber, events} = tripDay;

  return (`
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="${year}-${month}-${day}">${formatMonth(month)} ${day}</time>
      </div>
      <ul class="trip-events__list">
        ${events.map((event) => createEventItemTemplate(event)).join(`\n`)}
      </ul>
    </li>
  `);
};

export const createTrip = (allEvents) => {
  return allEvents.map((day) => createTripDay(day)).join(`\n`);
};
