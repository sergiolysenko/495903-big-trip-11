import {routePoints} from "./constants.js";
import {formatTime, routePointDuration, getRoutePointWithUpperFirstLetter} from "../utils/common.js";
import AbstractComponent from "./abstractComponent.js";

const generateOffers = (offers) => {

  const MAX_OFFERS = 2;
  return offers.map((offer, index) => {
    return (`<li class="event__offer ${index > MAX_OFFERS ? `visually-hidden` : ``}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>`);
  }).join(`\n`);
};

const createEventItemTemplate = (event) => {
  const {type, city, startTime, endTime, price, offers} = event;
  const isOfferShowing = !offers.lenght;
  const wichEventType = routePoints.transfer.includes(type) ? `transfer` : `activities`;

  return (`<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">
        ${getRoutePointWithUpperFirstLetter(type)} ${wichEventType === `transfer` ? `to` : `in`} 
        ${city.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTime}">${formatTime(startTime)}</time>
            &mdash;
            <time class="event__end-time" datetime="${endTime}">${formatTime(endTime)}</time>
          </p>
          <p class="event__duration">${routePointDuration(startTime, endTime)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
      ${isOfferShowing ? `
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${generateOffers(offers)}
        </ul>` : ``}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
};

export default class EventItemComponent extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventItemTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}

