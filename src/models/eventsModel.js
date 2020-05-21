import {getEventsByFilter} from "../utils/filter.js";
import {FiltersType} from "../components/constants.js";

export default class EventsModel {
  constructor() {
    this._events = [];
    this._destinations = [];
    this._offers = [];
    this._cities = [];
    this._activeFilterType = FiltersType.EVERYTHING;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }
  getEvents() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  getEventsAll() {
    return this._events;
  }

  getDestinationForCity(city) {
    return this._destinations.filter((it) => it.name === city);
  }

  getDestinations() {
    return this._destinations;
  }

  getCitiesList() {
    return this._cities;
  }

  getOffersForType(type) {
    const currentOffers = this._offers.filter((it) => it.type === type);
    if (!currentOffers.length) {
      return [];
    }
    return currentOffers[0].offers;
  }

  getOffers() {
    return this._offers;
  }

  setOffers(data) {
    this._offers = data;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setEvents(events) {
    this._events = Array.from(events);
    this._callHandlers(this._dataChangeHandlers);
  }

  setDestinations(data) {
    this._destinations = data;
    this.setCities(data);
  }

  setCities(data) {
    data.forEach((it) => this._cities.push(it.name));
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._callHandlers(this._dataChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

