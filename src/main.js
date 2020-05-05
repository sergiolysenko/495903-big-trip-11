import {MainInfoComponent} from "./components/main-info.js";
import {InfoCostComponent} from "./components/info-cost.js";
import {MainNavComponent} from "./components/main-nav.js";
import {MainFilterComponent} from "./components/main-filter.js";
import {generateEvents} from "./mock/event.js";
import {RenderPosition, render} from "./utils/render.js";
import {TripController} from "./controllers/tripcontroller.js";

const EVENTS_COUNT = 16;
const allEvents = generateEvents(EVENTS_COUNT);
const eventsSorted = allEvents.slice().sort((a, b) => a.startTime - b.startTime);

// Рендер блока инфо в шапке Маршрут и даты
const headerTripMainBlock = document.querySelector(`.trip-main`);
render(headerTripMainBlock, new MainInfoComponent(), RenderPosition.AFTERBEGIN);

// Рендер блока инфо в шапке общая стоимость поездки
const tripInfoBlock = headerTripMainBlock.querySelector(`.trip-info`);
render(tripInfoBlock, new InfoCostComponent(), RenderPosition.BEFOREEND);

// Рендер блока в шапке навигация
const headerTripControlsBlock = headerTripMainBlock.querySelector(`.trip-controls`);
const placeForInsertNav = headerTripControlsBlock.querySelector(`h2:last-child`);
render(placeForInsertNav, new MainNavComponent(), RenderPosition.INSERTBEFORE, placeForInsertNav);

// Рендер блока в шапке фильтры
render(headerTripControlsBlock, new MainFilterComponent(), RenderPosition.BEFOREEND);

const tripEventsBlock = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsBlock);
tripController.renderTrip(eventsSorted);
