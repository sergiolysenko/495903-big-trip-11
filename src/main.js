import API from "./api.js";
import EventsModel from "./models/events-model";
import FilterController from "./controllers/filter-controller.js";
import {RenderPosition, render} from "./utils/render.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip-controller.js";
import MainNavComponent from "./components/main-nav.js";
import MainInfoController from "./controllers/info-controller.js";
import {MenuItem} from "./components/constants.js";
import NewEventButtonComponent from "./components/new-event-button.js";

const AUTHORIZATION = `Basic ShdgajSS1set1i23HSDGJn2h@@`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const eventsModel = new EventsModel();

// Рендер блока инфо в шапке Маршрут и даты
const headerTripMainBlock = document.querySelector(`.trip-main`);
const mainInfoController = new MainInfoController(headerTripMainBlock, eventsModel);

// Рендер блока в шапке навигация
const headerTripControlsBlock = headerTripMainBlock.querySelector(`.trip-controls`);
const placeForInsertNav = headerTripControlsBlock.querySelector(`h2:last-child`);
const mainNavComponent = new MainNavComponent();
const newEventButtonComponent = new NewEventButtonComponent();
render(placeForInsertNav, mainNavComponent, RenderPosition.INSERTBEFORE, placeForInsertNav);

// Рендер блока в шапке фильтры
const filterController = new FilterController(headerTripControlsBlock, eventsModel);
filterController.render();

const tripEventsBlock = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsBlock, eventsModel, newEventButtonComponent, api);

const pageMainBodyContainer = document.querySelector(`.page-main .page-body__container`);
const statisticsComponent = new StatisticsComponent(eventsModel);
render(pageMainBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();


const onStatsChange = () => {
  tripController.hide();
  statisticsComponent.show();
  mainNavComponent.setActiveItem(MenuItem.STATS);
  filterController.setDefaultFilter();
};

const onTableChange = () => {
  filterController.setDefaultFilter();
  statisticsComponent.hide();
  tripController.show();
  mainNavComponent.setActiveItem(MenuItem.TABLE);
};
newEventButtonComponent.setOnClickHandler(onTableChange);
newEventButtonComponent.setOnClickHandler(tripController.onCreateNewEvent);

mainNavComponent.setOnClick((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      onStatsChange();
      break;
    case MenuItem.TABLE:
      onTableChange();
      break;
  }
});

const onEventsLoadError = () => {
  eventsModel.setEvents(``);
};

api.getOffers()
  .then((offers) => eventsModel.setOffers(offers));

api.getDestinations()
  .then((destinations) => eventsModel.setDestinations(destinations));

api.getEvents()
  .catch(onEventsLoadError)
  .then((events) => {
    eventsModel.setEvents(events);
    mainInfoController.render();
    tripController.renderTrip();
  });
