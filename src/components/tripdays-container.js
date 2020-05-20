import AbstractComponent from "./abstract-component.js";

const createTripDaysContainer = () => {
  return (`<ul class="trip-days">
    </ul>`);
};

export default class TripDaysComponent extends AbstractComponent {
  getTemplate() {
    return createTripDaysContainer();
  }
}
