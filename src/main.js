import {structureEventsByDays} from "./utils/common.js";
import {RenderPosition, render, replace} from "./utils/render.js";
import {MainInfoComponent} from "./components/main-info.js";
import {InfoCostComponent} from "./components/info-cost.js";
import {MainNavComponent} from "./components/main-nav.js";
import {MainFilterComponent} from "./components/main-filter.js";
import {MainTripSortComponent} from "./components/main-trip-sort.js";
import {NoPoints} from "./components/no-points.js";
import {TripDaysComponent} from "./components/tripdays-container.js";
import {EventItemComponent} from "./components/event-item.js";
import {EventItemEditComponent} from "./components/event-edit.js";
import {TripDayComponent} from "./components/tripday-container.js";
import {generateEvents} from "./mock/event.js";

const EVENTS_COUNT = 16;
const allEvents = generateEvents(EVENTS_COUNT);
const eventsSorted = allEvents.slice().sort((a, b) => a.startTime - b.startTime);
// Рендер блока инфо в шапке Маршрут и даты
const headerTripMainBlock = document.querySelector(`.trip-main`);
render(headerTripMainBlock, new MainInfoComponent(), RenderPosition.AFTERBEGIN);

// Рендер блока инфо в шапке общая стоимость поездки
const tripInfoBlock = headerTripMainBlock.querySelector(`.trip-info`);
render(tripInfoBlock, new InfoCostComponent(), RenderPosition.BEFOREEND);

// Рендер блока в шапке навигация
const headerTripControlsBlock = headerTripMainBlock.querySelector(`.trip-controls`);
const placeForInsertNav = headerTripControlsBlock.querySelector(`h2:last-child`);
render(headerTripControlsBlock, new MainNavComponent(), RenderPosition.INSERTBEFORE, placeForInsertNav);

// Рендер блока в шапке фильтры
render(headerTripControlsBlock, new MainFilterComponent(), RenderPosition.BEFOREEND);

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
const renderTrip = (events) => {
  const tripEventsBlock = document.querySelector(`.trip-events`);

  const isNoEvents = !events.length;

  if (isNoEvents) {
    render(tripEventsBlock, new NoPoints(), RenderPosition.BEFOREEND);
    return;
  }

  render(tripEventsBlock, new MainTripSortComponent(), RenderPosition.BEFOREEND);
  render(tripEventsBlock, new TripDaysComponent(), RenderPosition.BEFOREEND);
  const tripDaysBlock = tripEventsBlock.querySelector(`.trip-days`);

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

renderTrip(eventsSorted);

