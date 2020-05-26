import {structureEventsByDays} from "../utils/common.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import MainTripSortComponent, {SortType} from "../components/main-trip-sort.js";
import NoPoints from "../components/no-points.js";
import TripDaysComponent from "../components/tripdays-container.js";
import TripDayComponent from "../components/tripday-container.js";
import EventController, {Mode as EventControllerMode, emptyEvent} from "./event-controller.js";

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const eventsCopy = events.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = eventsCopy;
      break;
    case SortType.PRICE:
      sortedEvents = eventsCopy.sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedEvents = eventsCopy.sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
      break;
  }
  return sortedEvents;
};

export default class TripController {
  constructor(container, eventsModel, newEventButtonComponent, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._eventsList = document.querySelector(`.trip-events__list`);
    this._api = api;
    this._currentTypeSort = SortType.EVENT;
    this._renderedEventsControllers = null;
    this._noPointsComponent = new NoPoints();
    this._mainTripSortComponent = new MainTripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._tripDayComponent = new TripDayComponent();
    this._newEventButtonComponent = newEventButtonComponent;
    this._creatingEvent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this.onCreateNewEvent = this.onCreateNewEvent.bind(this);
    this._mainTripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.classList.add(`trip-events--hidden`);
    this._currentTypeSort = SortType.EVENT;
    this._mainTripSortComponent.setDefaultSortType();
    this._mainTripSortComponent.rerender();
    this._onViewChange();
  }

  show() {
    this._container.classList.remove(`trip-events--hidden`);
  }

  renderTrip() {
    const events = this._eventsModel.getEvents();
    this._container.querySelector(`.loading`).classList.add(`visually-hidden`);
    render(this._container, this._tripDaysComponent, RenderPosition.BEFOREEND);
    render(this._container, this._mainTripSortComponent, RenderPosition.AFTERBEGIN);
    const isNoEvents = !events.length;
    if (isNoEvents) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }
    this._renderDays(events, this._currentTypeSort);
  }

  onNoEvents(events) {
    const isNoEvents = !events.length;
    if (isNoEvents) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }
  }

  onCreateNewEvent() {
    this._newEventButtonComponent.toggleDisabledNewEvent();
    this._onFilterChange();
    this.createEvent();
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    if (!document.querySelector(`.trip-events__list`)) {
      const tripDaysBlock = this._container.querySelector(`.trip-days`);
      const tripDayComponent = new TripDayComponent();
      remove(this._noPointsComponent);
      render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
    }
    const container = document.querySelector(`.trip-events__list`);
    this._creatingEvent = new EventController(container, this._onDataChange, this._onViewChange, this._eventsModel);

    this._creatingEvent.render(emptyEvent, EventControllerMode.NEW_EVENT);
  }

  _onDataChange(eventController, oldData, newData, dontClose = false) {
    if (oldData === emptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        eventController.destroy();
        this._updateEvents();
        this._newEventButtonComponent.toggleDisabledNewEvent();
        this.onNoEvents(this._eventsModel.getEventsAll());
      } else {
        this._api.createEvent(newData)
          .then((eventModel) => {
            this._eventsModel.addEvent(eventModel);
            eventController.render(eventModel, EventControllerMode.DEFAULT);
            this._renderedEventsControllers = [].concat(eventController);
            this._newEventButtonComponent.toggleDisabledNewEvent();
            this._updateEvents();
          })
          .catch(() => {
            eventController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._eventsModel.removeEvent(oldData.id);
          this._updateEvents();
          this.onNoEvents(this._eventsModel.getEventsAll());
        })
        .catch(() => {
          eventController.shake();
        });
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((eventModel) => {
          const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);
          if (isSuccess && dontClose) {
            eventController.render(newData, EventControllerMode.EDIT);
          } else if (isSuccess) {
            eventController.render(newData, EventControllerMode.DEFAULT);
            this._updateEvents();
          }
        })
        .catch(() => {
          eventController.shake();
        });
    }
  }

  _onSortTypeChange(sortType) {
    this._onViewChange();
    this._removeEvents();
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._currentTypeSort = sortType;
    const sortedEvents = getSortedEvents(this._eventsModel.getEvents(), sortType);
    this._renderDays(sortedEvents, sortType);
  }

  _onViewChange() {
    if (this._renderedEventsControllers) {
      this._renderedEventsControllers.forEach((renderedEvent) => renderedEvent.setDefaultView());
    }
    if (this._creatingEvent) {
      this._creatingEvent.destroy();
      this._creatingEvent = null;
      this._newEventButtonComponent.toggleDisabledNewEvent();
    }
  }

  _removeEvents() {
    if (this._renderedEventsControllers) {
      this._renderedEventsControllers.forEach((renderedEvent) => renderedEvent.destroy());
    }
    this._renderedEventsControllers = [];
    this._tripDaysComponent.getElement().innerHTML = ``;
  }

  _updateEvents() {
    this._removeEvents();
    this._renderDays(this._eventsModel.getEvents(), this._currentTypeSort);
  }

  _onFilterChange() {
    this._currentTypeSort = SortType.EVENT;
    this._mainTripSortComponent.setDefaultSortType();
    this._mainTripSortComponent.rerender();
    this._onViewChange();
    this._updateEvents();
  }

  _renderEvents(eventsList, tripDayComponent, onDataChange, onViewChange) {
    const eventsListElement = tripDayComponent.getElement()
    .querySelector(`.trip-events__list`);
    return eventsList.map((event) => {
      const eventController = new EventController(eventsListElement, onDataChange, onViewChange, this._eventsModel);
      eventController.render(event, EventControllerMode.DEFAULT);

      return eventController;
    });
  }

  _renderDays(events, sortType) {
    const tripDaysBlock = this._container.querySelector(`.trip-days`);
    this._renderedEventsControllers = [];
    const isSortTypeEvent = sortType === SortType.EVENT;

    if (isSortTypeEvent) {
      const structureEvents = structureEventsByDays(events);
      structureEvents.forEach((day) => {
        const tripDayComponent = new TripDayComponent(day);
        const renderedPoints = this._renderEvents(day.events, tripDayComponent, this._onDataChange, this._onViewChange);
        this._renderedEventsControllers = this._renderedEventsControllers.concat(renderedPoints);
        render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
      });
    } else {
      const tripDayComponent = new TripDayComponent();
      this._renderedEventsControllers = this._renderEvents(events, tripDayComponent, this._onDataChange, this._onViewChange);
      render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
    }
  }
}

