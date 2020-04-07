import {createMainInfoTemplate} from "./components/main-info.js";
import {createInfoCostTemplate} from "./components/info-cost.js";
import {createMainNavTemplate} from "./components/main-nav.js";
import {createMainFilterTemplate} from "./components/main-filter.js";
import {createMainTripSortTemplate} from "./components/main-trip-sort.js";
import {createTripDaysContainer} from "./components/tripdays-container.js";
import {createTripDayContainer} from "./components/tripday-container.js";
import {createEventEditTemplate} from "./components/event-edit.js";
import {createEventItemTemplate} from "./components/event-item.js";

const EVENTS_COUNT = 3;

const render = (container, element, place) => {
  container.insertAdjacentHTML(place, element);
};
const headerTripMainBlock = document.querySelector(`.trip-main`);
render(headerTripMainBlock, createMainInfoTemplate(), `afterbegin`);

const tripInfoBlock = headerTripMainBlock.querySelector(`.trip-info`);
render(tripInfoBlock, createInfoCostTemplate(), `beforeend`);

const headerTripControlsBlock = headerTripMainBlock.querySelector(`.trip-controls`);
const placeForInsertNav = headerTripControlsBlock.querySelector(`h2`);
render(placeForInsertNav, createMainNavTemplate(), `afterend`);

const placeForInsertFilter = headerTripControlsBlock.querySelector(`h2:last-child`);
render(placeForInsertFilter, createMainFilterTemplate(), `afterend`);

const pageMainBlock = document.querySelector(`.page-main`);
const tripEventsBlock = pageMainBlock.querySelector(`.trip-events`);
const placeForTripSort = tripEventsBlock.querySelector(`h2`);
render(placeForTripSort, createMainTripSortTemplate(), `afterend`);

render(tripEventsBlock, createTripDaysContainer(), `beforeend`);
const tripDaysBlock = tripEventsBlock.querySelector(`.trip-days`);
render(tripDaysBlock, createTripDayContainer(), `beforeend`);

const tripEventsDayList = tripDaysBlock.querySelector(`.trip-events__list`);
render(tripEventsDayList, createEventEditTemplate(), `beforeend`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventsDayList, createEventItemTemplate(), `beforeend`);
}
