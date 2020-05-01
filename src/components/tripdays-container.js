import {AbstractComponent} from "./abstractComponent.js";

const createTripDaysContainer = () => {
  return (`<ul class="trip-days">
    </ul>`);
};

export class TripDaysComponent extends AbstractComponent {
  getTemplate() {
    return createTripDaysContainer();
  }
}
