import {routePoints} from "./constants.js";
import {formatTime, routePointDuration} from "./utils.js";

const generateOffers = (offers) => {
  const MAX_OFFERS = 2;
  return offers.map((offer, index) => {
    return (`
    <li class="event__offer ${index > MAX_OFFERS ? `visually-hidden` : ``}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>
    `);
  }).join(`\n`);
};

export const createEventItemTemplate = (event) => {
  const {eventType, city, startTime, endTime, price, offers} = event;
  const isOfferShowing = !!offers;
  const wichEventType = routePoints.transfer.includes(eventType) === `transfer` ? `to` : `in`;

  return (`
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventType} ${wichEventType} ${city}</h3>

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
    </li>
  `);
};
