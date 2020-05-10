import {structureEventsByDays} from "../utils/common.js";
import {RenderPosition, render} from "../utils/render.js";
import {MainTripSortComponent, SortType} from "../components/main-trip-sort.js";
import {NoPoints} from "../components/no-points.js";
import {TripDaysComponent} from "../components/tripdays-container.js";
import {TripDayComponent} from "../components/tripday-container.js";
import {EventController} from "./eventController.js";


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

class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._currentTypeSort = SortType.EVENT;
    this._renderedEventsControllers = null;
    this._noPointsComponent = new NoPoints();
    this._mainTripSortComponent = new MainTripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._tripDayComponent = new TripDayComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._mainTripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  renderTrip() {
    const events = this._eventsModel.getEvents();

    this._renderDays(events, this._currentTypeSort);
  }

  _onDataChange(eventController, oldData, newData) {
    const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

    if (isSuccess) {
      eventController.render(newData);
    }
  }

  _onSortTypeChange(sortType) {
    this._container.innerHTML = ``;
    this._tripDaysComponent.removeElement();
    this._currentTypeSort = sortType;
    const sortedEvents = getSortedEvents(this._eventsModel.getEvents(), sortType);
    this._renderDays(sortedEvents, sortType);
  }

  _onViewChange() {
    this._renderedEventsControllers.forEach((renderedEvent) => renderedEvent.setDefaultView());
  }

  _removeEvents() {
    this._renderedEventsControllers.forEach((renderedEvent) => renderedEvent.destroy());
    this._renderedEventsControllers = [];
    this._container.innerHTML = ``;
    this._tripDaysComponent.removeElement();
  }

  _updateEvents() {
    this._removeEvents();
    this._renderDays(this._eventsModel.getEvents(), this._currentTypeSort);
  }

  _onFilterChange() {
    this._updateEvents();
  }

  _renderEvents(eventsList, tripDayComponent, onDataChange, onViewChange) {
    const eventsListElement = tripDayComponent.getElement()
    .querySelector(`.trip-events__list`);
    return eventsList.map((event) => {
      const pointController = new EventController(eventsListElement, onDataChange, onViewChange);
      pointController.render(event);

      return pointController;
    });
  }

  _renderDays(events, sortType) {
    const container = this._container;
    const isNoEvents = !events.length;
    if (isNoEvents) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }
    render(this._container, this._mainTripSortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._tripDaysComponent, RenderPosition.BEFOREEND);
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

export {TripController};
