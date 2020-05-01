import {AbstractComponent} from "./abstractComponent.js";

const createMainNavTemplate = () => {
  return (`<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn" href="#">Table</a>
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Stats</a>
    </nav>`);
};

export class MainNavComponent extends AbstractComponent {
  getTemplate() {
    return createMainNavTemplate();
  }
}
