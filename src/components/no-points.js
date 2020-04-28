import {AbstractComponent} from "./abstractComponent.js";

const createNoPointsTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export class NoPoints extends AbstractComponent {
  getTemplate() {
    return createNoPointsTemplate();
  }
}
