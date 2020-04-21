import {structureEventsByDays, RenderPosition, render} from "./components/utils.js";
import {MainInfoComponent} from "./components/main-info.js";
import {InfoCostComponent} from "./components/info-cost.js";
import {MainNavComponent} from "./components/main-nav.js";
import {MainFilterComponent} from "./components/main-filter.js";
import {MainTripSortComponent} from "./components/main-trip-sort.js";
import {TripDaysComponent} from "./components/tripdays-container.js";
import {EventItemComponent} from "./components/event-item.js";
import {EventItemEditComponent} from "./components/event-edit.js";
import {TripDayComponent} from "./components/tripday-container.js";
import {generateEvents} from "./mock/event.js";

const EVENTS_COUNT = 16;
const allEvents = generateEvents(EVENTS_COUNT);

const headerTripMainBlock = document.querySelector(`.trip-main`);

render(headerTripMainBlock, new MainInfoComponent().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoBlock = headerTripMainBlock.querySelector(`.trip-info`);
render(tripInfoBlock, new InfoCostComponent().getElement(), RenderPosition.BEFOREEND);

const headerTripControlsBlock = headerTripMainBlock.querySelector(`.trip-controls`);
const placeForInsertNav = headerTripControlsBlock.querySelector(`h2:last-child`);
render(headerTripControlsBlock, new MainNavComponent().getElement(), RenderPosition.INSERTBEFORE, placeForInsertNav);

render(headerTripControlsBlock, new MainFilterComponent().getElement(), RenderPosition.BEFOREEND);

const renderEvent = (eventListElement, event) => {
  const onEditButtonClick = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };
  const onSubmitButtonClick = (evt) => {
    evt.preventDefault();
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const eventComponent = new EventItemComponent(event);
  const eventEditButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  eventEditButton.addEventListener(`click`, onEditButtonClick);

  const eventEditComponent = new EventItemEditComponent(event);
  const editForm = eventEditComponent.getElement().querySelector(`.event--edit`);
  const rollUpButton = eventEditComponent.getElement().querySelector(`.event__rollup-btn`);
  rollUpButton.addEventListener(`click`, onSubmitButtonClick);
  editForm.addEventListener(`submit`, onSubmitButtonClick);

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderTrip = (events) => {
  const pageMainBlock = document.querySelector(`.page-main`);
  const tripEventsBlock = pageMainBlock.querySelector(`.trip-events`);
  render(tripEventsBlock, new MainTripSortComponent().getElement(), RenderPosition.BEFOREEND);
  render(tripEventsBlock, new TripDaysComponent().getElement(), RenderPosition.BEFOREEND);
  const tripDaysBlock = tripEventsBlock.querySelector(`.trip-days`);

  const eventsSorted = events.slice().sort((a, b) => a.startTime - b.startTime);
  const structureEvents = structureEventsByDays(eventsSorted);

  structureEvents.forEach((day) => {
    const tripDayComponent = new TripDayComponent(day);
    const eventsListElement = tripDayComponent.getElement().querySelector(`.trip-events__list`);
    day.events.forEach((event) => {
      renderEvent(eventsListElement, event);
    });
    render(tripDaysBlock, tripDayComponent.getElement(), RenderPosition.BEFOREEND);
  });
};

renderTrip(allEvents);

