import {structureEventsByDays} from "../utils/common.js";
import {RenderPosition, render, replace} from "../utils/render.js";
import {MainTripSortComponent, SortType} from "../components/main-trip-sort.js";
import {NoPoints} from "../components/no-points.js";
import {TripDaysComponent} from "../components/tripdays-container.js";
import {EventItemComponent} from "../components/event-item.js";
import {EventItemEditComponent} from "../components/event-edit.js";
import {TripDayComponent} from "../components/tripday-container.js";

// Функция отрисовки точки маршрута с обработчиками
// открытия и закрытия формы редактирования
const renderEvent = (eventListElement, event) => {

  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };
  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const closeEdit = () => {
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closeEdit();
    }
  };

  const eventComponent = new EventItemComponent(event);
  eventComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const eventEditComponent = new EventItemEditComponent(event);
  eventEditComponent.setRollUpClickHandler(() => {
    closeEdit();
  });
  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    closeEdit();
  });

  render(eventListElement, eventComponent, RenderPosition.BEFOREEND);
};

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
    this._noPointsComponent = new NoPoints();
    this._mainTripSortComponent = new MainTripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._tripDayComponent = new TripDayComponent();
  }

  renderTrip(points) {
    const container = this._container;
    const isNoPoints = !points.length;
    if (isNoPoints) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }
    const structureEvents = structureEventsByDays(points);
    this._renderDays(structureEvents);

    this._mainTripSortComponent.setSortTypeChangeHandler((sortType) => {
      container.innerHTML = ``;
      this._tripDaysComponent.removeElement();
      const sortedEvents = getSortedEvents(points, sortType);
      this._renderDays(sortedEvents);
    });
  }

  _renderEvents(eventsList, tripDayComponent) {
    const eventsListElement = tripDayComponent.getElement()
    .querySelector(`.trip-events__list`);
    eventsList.forEach((event) => {
      renderEvent(eventsListElement, event);
    });
  }

  _renderDays(sortedEvents) {
    render(this._container, this._mainTripSortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._tripDaysComponent, RenderPosition.BEFOREEND);
    const tripDaysBlock = this._container.querySelector(`.trip-days`);

    const isEventsStructured = sortedEvents[0].hasOwnProperty(`day`);
    if (isEventsStructured) {
      sortedEvents.forEach((day) => {
        const tripDayComponent = new TripDayComponent(day);
        this._renderEvents(day.events, tripDayComponent);
        render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
      });
    } else {
      const tripDayComponent = new TripDayComponent();
      this._renderEvents(sortedEvents, tripDayComponent);
      render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
    }
  }
}

export {TripController};
