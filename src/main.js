import {MainInfoComponent} from "./components/main-info.js";
import {InfoCostComponent} from "./components/info-cost.js";
import {MainNavComponent} from "./components/main-nav.js";
import {generateEvents} from "./mock/event.js";
import {RenderPosition, render} from "./utils/render.js";
import {TripController} from "./controllers/tripcontroller.js";
import {EventsModel} from "./models/eventsModel";
import {FilterController} from "./controllers/filterController.js";

const EVENTS_COUNT = 16;
const allEvents = generateEvents(EVENTS_COUNT);
const eventsModel = new EventsModel();
eventsModel.setEvents(allEvents);

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
const filterController = new FilterController(headerTripControlsBlock, eventsModel);
filterController.render();

const tripEventsBlock = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsBlock, eventsModel);
tripController.renderTrip();
