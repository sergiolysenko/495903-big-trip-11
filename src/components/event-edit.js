import {routePoints} from "./constants.js";
import {formatDate, getRoutePointWithUpperFirstLetter, getCheckedOffersText, getCheckedOffers} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const ERROR_BORDER = `4px solid red`;

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
        ${currentOfferGroup.map((offer, index) => {
    const isOfferChecked = eventOffers.length ? eventOffers.find((item) => item.title === offer.title) : false;
    const isChecked = isOfferChecked ? `checked` : ``;

    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" 
      id="event-offer-${index}" type="checkbox" 
      name="event-offer-${index}"  
      ${isChecked}>
      <label class="event__offer-label" for="event-offer-${index}">
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
    `<p class="event__destination-description" name="destination-description">${descriptionText}</p>` : ``}
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
  const {isFavorite, newEmptyEvent = false} = event;
  const {type, city, price, offers, startTime, endTime, cities,
    citiesInfo, currentOfferGroup, externalData} = options;
  const isReadyToSave = !!price && !!city.name && !!startTime && !!endTime;
  const isNewEvent = newEmptyEvent;
  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  const isCityFieldEmpty = !city.name;

  const cityInfo = isNewEvent ? citiesInfo.filter((cityIfEmptyEvent) => cityIfEmptyEvent.name === city.name)[0]
    : city;

  const isDestinationInfoAvailable = isCityFieldEmpty ? false : !!cityInfo.description || !!cityInfo.pictures.length;
  const isOptionsAndInfoAvailable = isDestinationInfoAvailable || !!currentOfferGroup.length;
  const wichEventType = (eventItemType) => {
    return routePoints.transfer.includes(eventItemType) ? `to` : `in`;
  };

  const transferList = createTransferList(routePoints.transfer, `${type}`);
  const activityList = createTransferList(routePoints.activities, `${type}`);
  const citiesList = createCitiesList(cities);

  return (`<li class="trip-events__item">
    <form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" 
          src="img/icons/${type}.png" 
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
        ${getRoutePointWithUpperFirstLetter(type)} ${wichEventType(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" 
        name="event-destination" value="${city.name}" 
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

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isReadyToSave ? `` : `disabled`}>${saveButtonText}</button>
      <button class="event__reset-btn" type="reset">${isNewEvent ? `Cancel` : `${deleteButtonText}`}</button>
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

export default class EventItemEditComponent extends AbstractSmartComponent {
  constructor(event, eventsModel) {
    super();
    this._event = event;
    this._offers = event.offers;
    this._type = event.type;
    this._city = event.city;
    this._price = event.price;
    this._startTime = event.startTime;
    this._endTime = event.endTime;
    this._eventsModel = eventsModel;
    this._externalData = DefaultData;
    this._cities = this._eventsModel.getCitiesList();
    this._citiesInfo = this._eventsModel.getDestinations();
    this._currentOfferGroup = this._eventsModel.getOffersForType(this._type);
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
    return createEventEditTemplate(this._event, {
      type: this._type,
      city: this._city,
      offers: this._offers,
      price: this._price,
      startTime: this._startTime,
      endTime: this._endTime,
      cities: this._cities,
      citiesInfo: this._citiesInfo,
      currentOfferGroup: this._currentOfferGroup,
      externalData: this._externalData,
    });
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
    this._type = event.type;
    this._offers = event.offers;
    this._city = event.city;
    this._price = event.price;
    this._startTime = event.startTime;
    this._endTime = event.endTime;
    this._currentOfferGroup = this._eventsModel.getOffersForType(this._type);
    this.rerender();
  }

  blockForm() {
    const buttons = this.getElement().querySelectorAll(`button`);
    const formInputs = Array.from(this.getElement().querySelectorAll(`input`));
    formInputs.forEach((input) => {
      input.disabled = true;
    });
    buttons.forEach((button) => {
      button.disabled = true;
    });
  }

  onErrorRedBorder() {
    const form = this.getElement().querySelector(`.event--edit`);
    form.style.outline = ERROR_BORDER;
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
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
    return new FormData(form);
  }

  generateFlatpickr(element, {enableTime = true, minDate = null, altFormat = `d/m/y H:i`,
    altInput = true, allowInput = false, defaultDate, onClose}) {
    return flatpickr(element, {
      enableTime,
      minDate,
      altFormat,
      altInput,
      allowInput,
      defaultDate,
      onClose,
    });
  }

  _onTypeChange() {
    this._offers = this._event.offers;
    this._currentOfferGroup = this._eventsModel.getOffersForType(this._type);
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
    this._flatpickrStart = this.generateFlatpickr(startDate, {
      defaultDate: this._startTime || `today`,
      onClose: (selectedDates, dateStr) => {
        this._startTime = dateStr;
        this._flatpickrEnd.set(`minDate`, dateStr);
        this._flatpickrEnd.open();
      },
    });

    const endTime = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickrEnd = this.generateFlatpickr(endTime, {
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
      this._type = evt.target.value;
      this._onTypeChange();

      this.rerender();
    });

    const destList = element.querySelector(`.event__input--destination`);
    destList.addEventListener(`change`, () => {
      if (!destList.value || !this._cities.includes(destList.value)) {
        destList.value = this._city.name ? this._city.name : this._cities[0];
      }
      this._city = this._citiesInfo.filter((cityIfEmptyEvent) => cityIfEmptyEvent.name === destList.value)[0];
      this.rerender();
    });

    const priceInput = element.querySelector(`.event__input--price`);
    priceInput.addEventListener(`change`, () => {
      this._price = Math.round(priceInput.value);
      this.rerender();
    });

    const offersField = element.querySelector(`.event__available-offers`);
    if (offersField) {
      offersField.addEventListener(`change`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          const checkedOffersText = getCheckedOffersText(element);
          const currentOffersGroup = this._eventsModel.getOffersForType(this._type);
          const checkedOffers = getCheckedOffers(currentOffersGroup, checkedOffersText);
          this._offers = checkedOffers;
        }
      });
    }
  }
}

