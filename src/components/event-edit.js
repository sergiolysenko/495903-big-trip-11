import {routePoints, cities, offersItems} from "./constants.js";
import {formatDate, getRoutePointWithUpperFirstLetter} from "../utils/common.js";
import {AbstractSmartComponent} from "./abstractSmartComponent.js";
import {citiesInfo} from "../mock/event.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const parseFormData = (formData) => {
  const getNamesOdCheckedOffers = () => {
    let offers = [];
    const subStrLength = `event-offer-`.length;
    for (let pairKeyValue of formData.entries()) {
      if (pairKeyValue[0].indexOf(`event-offer-`) !== -1) {
        offers.push(pairKeyValue[0].substring(subStrLength));
      }
    }
    return offers;
  };

  const getCheckedOffers = () => {
    const checkedOffers = [];
    const checkedOffersNames = getNamesOdCheckedOffers();
    const currentOffersGroup = offersItems.filter((offerGroup) => {
      return offerGroup.type === formData.get(`event-type`);
    });
    checkedOffersNames.forEach((checkedOfferName) => {
      for (let offer of currentOffersGroup[0].offers) {
        if (checkedOfferName === offer.type) {
          checkedOffers.push(offer);
        }
      }
    });
    return checkedOffers;
  };

  return {
    eventType: formData.get(`event-type`),
    city: formData.get(`event-destination`),
    startTime: new Date(formData.get(`event-start-time`)),
    endTime: new Date(formData.get(`event-end-time`)),
    price: formData.get(`event-price`),
    isFavorite: formData.has(`event-favorite`),
    offers: getCheckedOffers(),
  };
};

const createTransferList = (routePointsItems, event) => {
  return routePointsItems.map((routePoint, index) => {
    const routePointWithUpperFirstLetter = getRoutePointWithUpperFirstLetter(routePoint);
    const isChecked = routePoint === event ? `checked` : ``;
    return (`<div class="event__type-item">
      <input 
        id="event-type-${routePoint}-${index}" 
        class="event__type-input  visually-hidden" 
        type="radio" name="event-type" 
        value="${routePoint}" ${isChecked}>
      <label 
        class="event__type-label  
        event__type-label--${routePoint}" 
        for="event-type-${routePoint}-${index}">
          ${routePointWithUpperFirstLetter}
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
  if (currentOfferGroup.length) {
    return `
    <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${currentOfferGroup[0].offers.map((offer, index) => {
    const isOfferChecked = eventOffers.find((item) => item.type === offer.type);
    const isChecked = isOfferChecked ? `checked` : ``;

    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" 
      id="event-offer-${offer.type}-${index}" type="checkbox" 
      name="event-offer-${offer.type}"  
      ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offer.type}-${index}">
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
    return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
  }).join(`\n`)}
              
        </div>
      </div>` : ``}
    </section>`;
};

const createEventEditTemplate = (event, options = {}) => {
  const {isFavorite, offers, newEmptyEvent = false} = event;
  const {eventType, cityName, price, startTime, endTime} = options;
  const isNewEvent = newEmptyEvent;
  const isReadyToSave = !!price && !!cityName && !!startTime && !!endTime;
  const currentOfferGroup = offersItems.filter((offersGroup) => offersGroup.type === eventType);
  const cityInfo = citiesInfo.filter((city) => city.name === cityName)[0];
  const isCityFieldEmpty = !cityName;
  const isDestinationInfoAvailable = isCityFieldEmpty ? false : !!cityInfo.description || !!cityInfo.pictures.length;
  const isOptionsAndInfoAvailable = isDestinationInfoAvailable || !!currentOfferGroup.length;
  const wichEventType = (eventItemType) => {
    return routePoints.transfer.includes(eventItemType) ? `to` : `in`;
  };

  const transferList = createTransferList(routePoints.transfer, `${eventType}`);
  const activityList = createTransferList(routePoints.activities, `${eventType}`);
  const citiesList = createCitiesList(cities);

  return (`<li class="trip-events__item">
    <form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" 
          src="img/icons/${eventType}.png" 
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
        ${getRoutePointWithUpperFirstLetter(eventType)} ${wichEventType(eventType)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" 
        name="event-destination" value="${cityName}" 
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
          value="${formatDate(startTime)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" 
          id="event-end-time-1" type="text" 
          name="event-end-time" 
          value="${formatDate(endTime)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" 
        id="event-price-1" type="number" 
        name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isReadyToSave ? `` : `disabled`}>Save</button>
      <button class="event__reset-btn" type="reset">${isNewEvent ? `Cancel` : `Delete`}</button>
      ${isNewEvent ? `` :
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
      </button>`}

    </header>
    ${isOptionsAndInfoAvailable ? `
    <section class="event__details">
      ${createOffers(currentOfferGroup, offers)}
      ${isCityFieldEmpty ? `` : `${isDestinationInfoAvailable ?
      createDestinationInfoMarkup(cityInfo.description, cityInfo.pictures) : ``}`}
      
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
    this._price = event.price;
    this._startTime = event.startTime;
    this._endTime = event.endTime;
    this.rollUpClickHandler = null;
    this.submitHandler = null;
    this.favoritButtonClickHandler = null;
    this._subscribeOnEvents();
    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._applyFlatpickr();
    this._deleteButtonClickHandler = null;
  }

  getTemplate() {
    return createEventEditTemplate(this._event,
        {eventType: this._eventType, cityName: this._city,
          price: this._price, startTime: this._startTime, endTime: this._endTime});
  }

  recoveryListeners() {
    this.setRollUpClickHandler(this.rollUpClickHandler);
    this.setSubmitHandler(this.submitHandler);
    this.setFavoritButtonClickHandler(this.favoritButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  removeElement() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }
    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }
    super.removeElement();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const event = this._event;
    this._eventType = event.eventType;
    this._city = event.city;
    this._price = event.price;
    this._startTime = event.startTime;
    this._endTime = event.endTime;
    this.rerender();
  }

  setRollUpClickHandler(handler) {
    const rollUpButton = this.getElement().querySelector(`.event__rollup-btn`);
    if (rollUpButton) {
      rollUpButton.addEventListener(`click`, handler);
    }
    this.rollUpClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.event--edit`)
      .addEventListener(`submit`, handler);
    this.submitHandler = handler;
  }

  setFavoritButtonClickHandler(handler) {
    const buttonFavorite = this.getElement().querySelector(`.event__favorite-checkbox`); if (buttonFavorite) {
      buttonFavorite.addEventListener(`click`, handler);
    }
    this.favoritButtonClickHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);
    const parseData = parseFormData(formData);
    return parseData;
  }

  _applyFlatpickr() {
    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }

    const startDate = this.getElement().querySelector(`#event-start-time-1`);
    this._flatpickrStart = flatpickr(startDate, {
      enableTime: true,
      altFormat: `d/m/y H:i`,
      altInput: true,
      allowInput: true,
      defaultDate: this._startTime || `today`,
      onClose: (selectedDates, dateStr) => {
        this._startTime = dateStr;
        this._flatpickrEnd.set(`minDate`, dateStr);
        this._flatpickrEnd.open();
      },
    });

    const endTime = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickrEnd = flatpickr(endTime, {
      enableTime: true,
      minDate: startDate.value,
      altFormat: `d/m/y H:i`,
      altInput: true,
      allowInput: true,
      defaultDate: this._endTime || `today`,
      onClose: (selectedDates, dateStr) => {
        this._endTime = dateStr;
      },
    });
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
      if (!destList.value || !cities.includes(destList.value)) {
        destList.value = this._city;
      }
      this._city = destList.value;
      this.rerender();
    });

    const priceInput = element.querySelector(`.event__input--price`);
    priceInput.addEventListener(`change`, () => {
      this._price = priceInput.value;
      this.rerender();
    });
  }

}

