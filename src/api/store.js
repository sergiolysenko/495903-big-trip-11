import {StoreGroup} from "../components/constants.js";

export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getStore() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getItems(key) {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey))[key] || {};
    } catch (err) {
      return {};
    }
  }

  setEvent(key, value) {
    const eventsStore = this.getItems(StoreGroup.EVENTS);
    const updatedEvents = Object.assign({}, eventsStore, {[key]: value});
    this.setItems(StoreGroup.EVENTS, updatedEvents);
  }

  setItems(key, items) {
    const store = this.getStore();
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: items
            })
        ));
  }

  removeItem(key) {
    const eventsStore = this.getItems(StoreGroup.EVENTS);

    delete eventsStore[key];
    this.setItems(StoreGroup.EVENTS, eventsStore);
  }
}
