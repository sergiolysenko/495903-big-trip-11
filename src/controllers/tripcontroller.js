import {structureEventsByDays} from "../utils/common.js";
import {RenderPosition, render} from "../utils/render.js";
import MainTripSortComponent, {SortType} from "../components/main-trip-sort.js";
import NoPoints from "../components/no-points.js";
import TripDaysComponent from "../components/tripdays-container.js";
import TripDayComponent from "../components/tripday-container.js";
import EventController, {Mode as EventControllerMode, emptyEvent} from "./eventController.js";
import NewEventButtonComponent from "../components/newEventButtonComponent.js";

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
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._currentTypeSort = SortType.EVENT;
    this._renderedEventsControllers = null;
    this._noPointsComponent = new NoPoints();
    this._mainTripSortComponent = new MainTripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._tripDayComponent = new TripDayComponent();
    this._newEventButtonComponent = new NewEventButtonComponent();
    this._creatingEvent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onCreateNewEvent = this._onCreateNewEvent.bind(this);
    this._mainTripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
    this._newEventButtonComponent.setOnClick(this._onCreateNewEvent);
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
    const isNoEvents = !events.length;
    if (isNoEvents) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }
    render(this._container, this._mainTripSortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._tripDaysComponent, RenderPosition.BEFOREEND);
    this._renderDays(events, this._currentTypeSort);
  }

  _onDataChange(eventController, oldData, newData, dontClose = false) {
    if (oldData === emptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        eventController.destroy();
        this._updateEvents();
        this._newEventButtonComponent.toggleDisabledNewEvent();
      } else {
        this._eventsModel.addEvent(newData);
        eventController.render(newData, EventControllerMode.DEFAULT);
        this._renderedEventsControllers = [].concat(eventController);
        this._newEventButtonComponent.toggleDisabledNewEvent();
        this._updateEvents();
      }
    } else if (newData === null) {
      this._eventsModel.removeEvent(oldData.id);
      this._updateEvents();
    } else {
      const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);
      if (isSuccess && dontClose) {
        eventController.render(newData, EventControllerMode.EDIT);
      } else if (isSuccess) {
        eventController.render(newData, EventControllerMode.DEFAULT);
        this._updateEvents();
      }
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
    this._renderedEventsControllers.forEach((renderedEvent) => renderedEvent.setDefaultView());
    if (this._creatingEvent) {
      this._creatingEvent.destroy();
      this._creatingEvent = null;
      this._newEventButtonComponent.toggleDisabledNewEvent();
    }
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const eventsListElement = document.querySelector(`.trip-events__list`);
    this._creatingEvent = new EventController(eventsListElement, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(emptyEvent, EventControllerMode.NEW_EVENT);
  }

  _removeEvents() {
    this._renderedEventsControllers.forEach((renderedEvent) => renderedEvent.destroy());
    this._renderedEventsControllers = [];
    this._tripDaysComponent.getElement().innerHTML = ``;
  }

  _updateEvents() {
    this._removeEvents();
    this._renderDays(this._eventsModel.getEvents(), this._currentTypeSort);
  }

  _onCreateNewEvent() {
    this.show();
    this._newEventButtonComponent.toggleDisabledNewEvent();
    this._onFilterChange();
    this.createEvent();
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
      const eventController = new EventController(eventsListElement, onDataChange, onViewChange);
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

