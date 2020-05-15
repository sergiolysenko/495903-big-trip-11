import MainNavComponent, {MenuItem} from "./components/main-nav.js";
import {generateEvents} from "./mock/event.js";
import {RenderPosition, render} from "./utils/render.js";
import TripController from "./controllers/tripcontroller.js";
import EventsModel from "./models/eventsModel";
import FilterController from "./controllers/filterController.js";
import MainInfoController from "./controllers/infoController.js";
import StatisticsComponent from "./components/statistics.js";


const EVENTS_COUNT = 16;
const allEvents = generateEvents(EVENTS_COUNT);
const eventsModel = new EventsModel();
eventsModel.setEvents(allEvents);

// Рендер блока инфо в шапке Маршрут и даты
const headerTripMainBlock = document.querySelector(`.trip-main`);
const mainInfoController = new MainInfoController(headerTripMainBlock, eventsModel);
mainInfoController.render();

// Рендер блока в шапке навигация
const headerTripControlsBlock = headerTripMainBlock.querySelector(`.trip-controls`);
const placeForInsertNav = headerTripControlsBlock.querySelector(`h2:last-child`);
const mainNavComponent = new MainNavComponent();
render(placeForInsertNav, mainNavComponent, RenderPosition.INSERTBEFORE, placeForInsertNav);

// Рендер блока в шапке фильтры
const filterController = new FilterController(headerTripControlsBlock, eventsModel);
filterController.render();

const tripEventsBlock = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsBlock, eventsModel);
tripController.renderTrip();

const pageMainBodyContainer = document.querySelector(`.page-main .page-body__container`);
const statisticsComponent = new StatisticsComponent(eventsModel);
render(pageMainBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();


mainNavComponent.setOnClick((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      tripController.hide();
      statisticsComponent.show();
      mainNavComponent.setActiveItem(menuItem);
      filterController.setDefaultFilter();
      break;
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      mainNavComponent.setActiveItem(menuItem);
      filterController.setDefaultFilter();
      break;
  }
});
