import {structureEventsByDays} from "../utils/common.js";
import {RenderPosition, render} from "../utils/render.js";
import {MainTripSortComponent, SortType} from "../components/main-trip-sort.js";
import {NoPoints} from "../components/no-points.js";
import {TripDaysComponent} from "../components/tripdays-container.js";
import {TripDayComponent} from "../components/tripday-container.js";
import {EventController} from "../controllers/pointController.js";

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const eventsCopy = events.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = structureEventsByDays(eventsCopy);
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
  constructor(container) {
    this._container = container;

    this._points = [];
    this._renderedPoints = null;
    this._noPointsComponent = new NoPoints();
    this._mainTripSortComponent = new MainTripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._tripDayComponent = new TripDayComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._mainTripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  renderTrip(points) {
    this._points = points;
    const container = this._container;
    const isNoPoints = !points.length;
    if (isNoPoints) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }
    const structureEvents = structureEventsByDays(points);
    this._renderDays(structureEvents);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._points.findIndex((item) => item === oldData);

    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));
    pointController.render(this._points[index]);
  }

  _onSortTypeChange(sortType) {
    this._container.innerHTML = ``;
    this._tripDaysComponent.removeElement();
    const sortedEvents = getSortedEvents(this._points, sortType);
    this._renderDays(sortedEvents);
  }

  _onViewChange() {
    this._renderedPoints.forEach((renderedPoint) => renderedPoint.setDefaultView());
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

  _renderDays(sortedEvents) {
    render(this._container, this._mainTripSortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._tripDaysComponent, RenderPosition.BEFOREEND);
    const tripDaysBlock = this._container.querySelector(`.trip-days`);
    this._renderedPoints = [];
    const isEventsStructured = sortedEvents[0].hasOwnProperty(`day`);
    if (isEventsStructured) {
      sortedEvents.forEach((day) => {
        const tripDayComponent = new TripDayComponent(day);
        const renderedPoints = this._renderEvents(day.events, tripDayComponent, this._onDataChange, this._onViewChange);
        this._renderedPoints = this._renderedPoints.concat(renderedPoints);
        render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
      });
    } else {
      const tripDayComponent = new TripDayComponent();
      this._renderedPoints = this._renderEvents(sortedEvents, tripDayComponent, this._onDataChange, this._onViewChange);
      render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
    }
  }
}

export {TripController};
