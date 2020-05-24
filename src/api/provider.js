import EventModel from "../models/event-model.js";
import {StoreGroup} from "../components/constants.js";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
  .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
      .then((events) => {
        const items = createStoreStructure(events.map((event) => event.toRAW()));
        this._store.setItems(StoreGroup.EVENTS, items);

        return events;
      });
    }

    const storeEvents = Object.values(this._store.getItems(StoreGroup.EVENTS));
    return Promise.resolve(EventModel.parseEvents(storeEvents));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
      .then((destinations) => {
        this._store.setItems(StoreGroup.DESTINATIONS, destinations);

        return destinations;
      });
    }
    const storeDestinations = this._store.getItems(StoreGroup.DESTINATIONS);
    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
      .then((offers) => {
        this._store.setItems(StoreGroup.OFFERS, offers);

        return offers;
      });
    }

    const storeOffers = this._store.getItems(StoreGroup.OFFERS);
    return Promise.resolve(storeOffers);
  }

  createEvent(event) {
    if (isOnline()) {
      return this._api.createEvent(event)
      .then((newEvent) => {
        this._store.setEvent(newEvent.id, newEvent.toRAW());

        return newEvent;
      });
    }
    const localNewEventId = nanoid();
    const localNewEvent = EventModel.clone(Object.assign(event, {id: localNewEventId}));

    this._store.setEvent(localNewEvent.id, localNewEvent.toRAW());

    return Promise.resolve(localNewEvent);
  }

  updateEvent(id, data) {
    if (isOnline()) {
      return this._api.updateEvent(id, data)
        .then((newEvent) => {
          this._store.setEvent(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localEvent = EventModel.clone(Object.assign(data, {id}));
    this._store.setEvent(id, localEvent.toRAW());

    return Promise.resolve(localEvent);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
      .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems(StoreGroup.EVENTS));
      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);
          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
