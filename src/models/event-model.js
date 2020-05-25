export default class EventModel {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.city = data[`destination`];
    this.startTime = new Date(data[`date_from`]);
    this.endTime = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
  }

  toRAW() {
    return {
      "base_price": this.price,
      "date_from": this.startTime,
      "date_to": this.endTime,
      "destination": this.city,
      "id": this.id,
      "is_favorite": this.isFavorite,
      "offers": this.offers,
      "type": this.type,
    };
  }

  static parse(data) {
    return new EventModel(data);
  }

  static parseEvents(data) {
    return data.map(EventModel.parse);
  }

  static clone(data) {
    return new EventModel(data.toRAW());
  }
}
