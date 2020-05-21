import API from "./api.js";
import EventsModel from "./models/eventsModel";
import FilterController from "./controllers/filterController.js";
import {RenderPosition, render} from "./utils/render.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/tripcontroller.js";
import MainNavComponent from "./components/main-nav.js";
import MainInfoController from "./controllers/infoController.js";
import {MenuItem} from "./components/constants.js";

const AUTHORIZATION = `Basic ShdgajSS1set1i23HSDGJn2h@@`;

const api = new API(AUTHORIZATION);
const eventsModel = new EventsModel();

// Рендер блока инфо в шапке Маршрут и даты
const headerTripMainBlock = document.querySelector(`.trip-main`);
const mainInfoController = new MainInfoController(headerTripMainBlock, eventsModel);

// Рендер блока в шапке навигация
const headerTripControlsBlock = headerTripMainBlock.querySelector(`.trip-controls`);
const placeForInsertNav = headerTripControlsBlock.querySelector(`h2:last-child`);
const mainNavComponent = new MainNavComponent();
render(placeForInsertNav, mainNavComponent, RenderPosition.INSERTBEFORE, placeForInsertNav);

// Рендер блока в шапке фильтры
const filterController = new FilterController(headerTripControlsBlock, eventsModel);
filterController.render();

const tripEventsBlock = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsBlock, eventsModel, mainNavComponent, api);

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

api.getOffers()
  .then((offers) => eventsModel.setOffers(offers));

api.getDestinations()
  .then((destinations) => eventsModel.setDestinations(destinations));

api.getEvents()
  .then((events) => {
    eventsModel.setEvents(events);
    mainInfoController.render();
    tripController.renderTrip();
  });
