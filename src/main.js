import API from "./api/index.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import EventsModel from "./models/events-model";
import FilterController from "./controllers/filter-controller.js";
import {RenderPosition, render} from "./utils/render.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip-controller.js";
import MainNavComponent from "./components/main-nav.js";
import MainInfoController from "./controllers/info-controller.js";
import {MenuItem} from "./components/constants.js";
import NewEventButtonComponent from "./components/new-event-button.js";

const AUTHORIZATION = `Basic Shdga2et1i23HSDG`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const eventsModel = new EventsModel();

const headerTripMainBlock = document.querySelector(`.trip-main`);
const mainInfoController = new MainInfoController(headerTripMainBlock, eventsModel);

const headerTripControlsBlock = headerTripMainBlock.querySelector(`.trip-controls`);
const placeForInsertNav = headerTripControlsBlock.querySelector(`h2:last-child`);
const mainNavComponent = new MainNavComponent();
const newEventButtonComponent = new NewEventButtonComponent();
render(placeForInsertNav, mainNavComponent, RenderPosition.INSERTBEFORE, placeForInsertNav);

const filterController = new FilterController(headerTripControlsBlock, eventsModel);
filterController.render();

const tripEventsBlock = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsBlock, eventsModel, newEventButtonComponent, apiWithProvider);

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

apiWithProvider.getOffers()
  .then((offers) => eventsModel.setOffers(offers));

apiWithProvider.getDestinations()
  .then((destinations) => eventsModel.setDestinations(destinations));

apiWithProvider.getEvents()
  .catch(onEventsLoadError)
  .then((events) => {
    eventsModel.setEvents(events);
    mainInfoController.render();
    tripController.renderTrip();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .catch(() => {
      throw new Error(`service worker do not registred`);
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (apiWithProvider.getSyncStatus()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
