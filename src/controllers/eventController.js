import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {getCheckedOffersText, getCheckedOffers, getPhotosTape} from "../utils/common.js";
import EventModel from "../models/eventModel.js";
import EventItemComponent from "../components/event-item.js";
import EventItemEditComponent from "../components/event-edit.js";

const Mode = {
  NEW_EVENT: `new`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const emptyEvent = {
  type: `bus`,
  city: {name: ``,
    description: ``,
    pictures: [],
  },
  startTime: new Date(),
  endTime: new Date(),
  price: ``,
  isFavorite: false,
  offers: [],
  newEmptyEvent: true,
};

const parseFormData = (formData, id, eventsModel, element) => {
  const offersGroup = eventsModel.getOffersForType(formData.get(`event-type`));
  const checkedOffersText = getCheckedOffersText(element);
  const checkedOffers = getCheckedOffers(offersGroup, checkedOffersText);
  const description = element.querySelector(`.event__destination-description`);
  const isDescription = description ? description.textContent : ``;
  return new EventModel({
    "id": id,
    "base_price": parseInt(formData.get(`event-price`), 10),
    "date_from": new Date(formData.get(`event-start-time`)),
    "date_to": new Date(formData.get(`event-end-time`)),
    "type": formData.get(`event-type`),
    "destination": {
      "name": formData.get(`event-destination`),
      "description": isDescription,
      "pictures": getPhotosTape(element),
    },
    "offers": checkedOffers,
    "is_favorite": formData.has(`event-favorite`),
  });
};

export default class EventController {
  constructor(container, onDataChange, onViewChange, eventsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._eventsModel = eventsModel;
    this._mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    this._mode = mode;
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._eventComponent = new EventItemComponent(event);
    this._eventEditComponent = new EventItemEditComponent(event, this._eventsModel);

    this._eventEditComponent.setFavoritButtonClickHandler(() => {
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !newEvent.isFavorite;

      this._onDataChange(this, event, newEvent, true);
    });

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setRollUpClickHandler(() => {
      this._closeEdit();
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, event.id, this._eventsModel, this._eventEditComponent.getElement());
      this._onDataChange(this, event, data);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, event, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._closeEdit();
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.NEW_EVENT:
        if (oldEventComponent && oldEventEditComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.AFTERBEGIN);
        break;
      case Mode.EDIT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
        }
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    this._eventEditComponent.reset();
    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _closeEdit() {
    this._replaceEditToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.NEW_EVENT) {
        this._onDataChange(this, emptyEvent, null);
      }
      this._closeEdit();
    }
  }
}
export {Mode, emptyEvent};
