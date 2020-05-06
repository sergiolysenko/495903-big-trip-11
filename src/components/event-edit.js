import {routePoints, cities, offersItems} from "./constants.js";
import {formatTime, formatDate} from "../utils/common.js";
import {AbstractSmartComponent} from "./abstractSmartComponent.js";
import {citiesInfo} from "../mock/event.js";

const createTransferList = (routePointsItems, event) => {
  return routePointsItems.map((item, index) => {
    const lowerCaseItem = item.toLowerCase();
    const isChecked = item === event ? `checked` : ``;
    return (`<div class="event__type-item">
      <input 
        id="event-type-${lowerCaseItem}-${index}" 
        class="event__type-input  visually-hidden" 
        type="radio" name="event-type" 
        value="${lowerCaseItem}" ${isChecked}>
      <label 
        class="event__type-label  
        event__type-label--${lowerCaseItem}" 
        for="event-type-${lowerCaseItem}-${index}">
          ${item}
        </label>
    </div>`);
  }).join(`\n`);
};

const createCitiesList = (citiesList) => {
  return citiesList.map((item) => {
    return `<option value="${item}"></option>`;
  }).join(`\n`);
};

const createOffers = (currentOfferGroup, eventOffers) => {
  if (currentOfferGroup) {
    return `
    <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${currentOfferGroup.map((offer) => {
    const isOfferChecked = eventOffers.find((item) => item.type === offer.type);
    const isChecked = isOfferChecked ? `checked` : ``;

    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" 
      id="event-offer-${offer.type}-1" type="checkbox" 
      name="event-offer-${offer.type}"  
      ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offer.type}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join(`\n`)}
        </div>
      </section>`;
  } else {
    return ``;
  }
};

const createDestinationInfoMarkup = (descriptionText, photos) => {
  const isTextAvailable = !!descriptionText;
  const isPhotosAvailable = !!photos.length;

  return `
    <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          ${isTextAvailable ?
    `<p class="event__destination-description">${descriptionText}</p>` : ``}
          ${isPhotosAvailable ? `
          <div class="event__photos-container">
            <div class="event__photos-tape">
              
    ${photos.map((photo) => {
    return `<img class="event__photo" src="${photo}" alt="Event photo">`;
  }).join(`\n`)}
              
        </div>
      </div>` : ``}
    </section>`;
};

const createEventEditTemplate = (event, options = {}) => {
  const {startTime, endTime, price,
    isFavorite, offers, dayRoute} = event;
  const {eventType, cityName} = options;

  const isEvent = dayRoute;
  const currentOfferGroup = eventType in offersItems ? offersItems[eventType] : false;
  const cityInfo = citiesInfo.filter((city) => city.name === cityName)[0];
  const isDestinationInfoAvailable = !!cityInfo.descriptionText || !!cityInfo.photo.length;
  const isOptionsAndInfoAvailable = isDestinationInfoAvailable || currentOfferGroup;

  const wichEventType = (eventItemType) => {
    return routePoints.transfer.includes(eventItemType) ? `to` : `in`;
  };
  const defaultEventType = `Flight`;
  const defaultCity = `Paris`;

  const transferList = createTransferList(routePoints.transfer, `${isEvent ? eventType : defaultEventType}`);
  const activityList = createTransferList(routePoints.activities, `${isEvent ? eventType : ``}`);
  const citiesList = createCitiesList(cities);

  return (`<li class="trip-events__item">
    <form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" 
          src="img/icons/${isEvent ? eventType : `flight`}.png" 
          alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            ${transferList}            
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>
            ${activityList}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${isEvent ? eventType : defaultEventType} ${isEvent ? wichEventType(eventType) : wichEventType(defaultEventType)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" 
        name="event-destination" value="${isEvent ? cityName : defaultCity}" 
        list="destination-list-1">
        <datalist id="destination-list-1">
          ${citiesList}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" 
          id="event-start-time-1" 
          type="text" name="event-start-time" 
          value="${isEvent ? `${formatDate(startTime)} ${formatTime(startTime)}` : `18/03/19 00:00`}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" 
          id="event-end-time-1" type="text" 
          name="event-end-time" 
          value="${isEvent ? `${formatDate(endTime)} ${formatTime(endTime)}` : `18/03/19 00:00`}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" 
        id="event-price-1" type="text" 
        name="event-price" value="${isEvent ? price : ``}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isEvent ? `Delete` : `Cancel`}</button>
      ${isEvent ?
      `<input id="event-favorite-1" class="event__favorite-checkbox  
      visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>` : ``}

    </header>
    ${isOptionsAndInfoAvailable ? `
    <section class="event__details">
      ${createOffers(currentOfferGroup, offers)}

      ${isDestinationInfoAvailable ?
      createDestinationInfoMarkup(cityInfo.descriptionText, cityInfo.photo) : ``}
    </section>` : ``}
  </form>
    </li>`);
};

export class EventItemEditComponent extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;
    this._eventType = event.eventType;
    this._city = event.city;
    this.rollUpClickHandler = null;
    this.submitHandler = null;
    this.favoritButtonClickHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEventEditTemplate(this._event, {eventType: this._eventType, cityName: this._city});
  }

  recoveryListeners() {
    this.setRollUpClickHandler(this.rollUpClickHandler);
    this.setSubmitHandler(this.submitHandler);
    this.setFavoritButtonClickHandler(this.favoritButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const event = this._event;
    this._eventType = event.eventType;
    this._city = event.city;
    this.rerender();
  }

  setRollUpClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this.rollUpClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.event--edit`)
      .addEventListener(`submit`, handler);
    this.submitHandler = handler;
  }

  setFavoritButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);
    this.favoritButtonClickHandler = handler;
  }
  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      evt.target.checked = true;
      this._eventType = evt.target.value;
      this.rerender();
    });

    const destList = element.querySelector(`.event__input--destination`);
    destList.addEventListener(`change`, () => {
      if (!destList.value) {
        destList.value = this._city;
      }
      this._city = destList.value;
      this.rerender();
    });
  }

}

