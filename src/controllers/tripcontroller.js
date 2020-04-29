import {structureEventsByDays} from "../utils/common.js";
import {RenderPosition, render, replace} from "../utils/render.js";
import {MainTripSortComponent} from "../components/main-trip-sort.js";
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
// Рендер всего поля с маршрутами путешествия: блок сортировки,
// блок для отрисовки дней (TripDays), отрисовка каждого дня и
// отрисовка каждой точки маршрута.
const renderTrip = (eventsBlock, events) => {
  const isNoEvents = !events.length;

  if (isNoEvents) {
    render(eventsBlock, new NoPoints(), RenderPosition.BEFOREEND);
    return;
  }

  render(eventsBlock, new MainTripSortComponent(), RenderPosition.BEFOREEND);
  render(eventsBlock, new TripDaysComponent(), RenderPosition.BEFOREEND);
  const tripDaysBlock = eventsBlock.querySelector(`.trip-days`);

  // структуризация событий по датам
  const structureEvents = structureEventsByDays(events);

  // отрисовка блока для каждого дня маршрута
  structureEvents.forEach((day) => {
    const tripDayComponent = new TripDayComponent(day);
    const eventsListElement = tripDayComponent.getElement().querySelector(`.trip-events__list`);

    // отрисовка всех точек маршрута текущего дня
    day.events.forEach((event) => {
      renderEvent(eventsListElement, event);
    });
    render(tripDaysBlock, tripDayComponent, RenderPosition.BEFOREEND);
  });
};

class TripController {
  constructor(container) {
    this._container = container;
  }

  render(events) {
    renderTrip(this._container, events);
  }
}

export {TripController};
