import EventModel from "../models/event-model.js";

const ApiUrlOptions = {
  POINTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
  SYNC: `points/sync`,
};
const Code = {
  OK: 200,
  NOT_OK: 300,
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};
const headerData = {"Content-Type": `application/json`};

const checkStatus = (response) => {
  if (response.status >= Code.OK && response.status < Code.NOT_OK) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: ApiUrlOptions.POINTS})
    .then((response) => response.json())
    .then(EventModel.parseEvents);
  }

  getDestinations() {
    return this._load({url: ApiUrlOptions.DESTINATIONS})
    .then((response) => response.json());
  }

  getOffers() {
    return this._load({url: ApiUrlOptions.OFFERS})
    .then((response) => response.json());
  }

  createEvent(event) {
    return this._load({
      url: ApiUrlOptions.POINTS,
      method: Method.POST,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers(headerData)
    })
      .then((response) => response.json())
      .then(EventModel.parse);
  }

  updateEvent(id, data) {
    return this._load({
      url: `${ApiUrlOptions.POINTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers(headerData)
    })
      .then((response) => response.json())
      .then(EventModel.parse)
      .catch((err) => {
        throw err;
      });
  }

  deleteEvent(id) {
    return this._load({url: `${ApiUrlOptions.POINTS}/${id}`, method: Method.DELETE});
  }

  sync(data) {
    return this._load({
      url: `${ApiUrlOptions.SYNC}`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers(headerData)
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
