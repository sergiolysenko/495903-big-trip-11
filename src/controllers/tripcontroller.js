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
      sortedEvents = eventsCopy.sort((a, b) => a.price - b.price);
      break;
    case SortType.TIME:
      sortedEvents = eventsCopy.sort((a, b) => (a.endTime - a.startTime) - (b.endTime - b.startTime));
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
  }

  render(points) {
    const container = this._container;
    const isNoPoints = !points.length;
    if (isNoPoints) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    // функция отрисовки всех событий
    const renderEvents = (eventsList, tripDayComponent) => {
      const eventsListElement = tripDayComponent.getElement()
      .querySelector(`.trip-events__list`);
      eventsList.forEach((event) => {
        renderEvent(eventsListElement, event);
      });
    };
    // В зависимости от сортировки отрисуется:
    // Сортировка Евентс - каждый день маршрута и точки маршрута в нем
    // Другие сортировки - один блок дня и сразу все точки маршрута
    const renderDays = (sortedEvents) => {
      render(container, this._mainTripSortComponent, RenderPosition.BEFOREEND);
      render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);
      const tripDaysBlock = container.querySelector(`.trip-days`);

      const isEventsStructured = sortedEvents[0].hasOwnProperty(`day`);
      if (isEventsStructured) {
        sortedEvents.forEach((day) => {
          const tripDayComponent = new TripDayComponent(day);
          renderEvents(day.events, tripDayComponent);
          render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
        });
      } else {
        const tripDayComponent = new TripDayComponent();
        renderEvents(sortedEvents, tripDayComponent);
        render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
      }
    };
    // структуризация событий по датам
    const structureEvents = structureEventsByDays(points);
    renderDays(structureEvents);

    this._mainTripSortComponent.setSortTypeChangeHandler((sortType) => {
      container.innerHTML = ``;
      this._tripDaysComponent.removeElement();
      const sortedEvents = getSortedEvents(points, sortType);
      renderDays(sortedEvents);
    });
  }
}

export {TripController};
