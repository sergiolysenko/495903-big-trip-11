import {AbstractComponent} from "./abstractComponent.js";

const MenuItem = {
  TABLE: `trip-tabs__btn--table`,
  STATS: `trip-tabs__btn--stats`,
};

const createMainNavTemplate = () => {
  return (`<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn trip-tabs__btn--active" id="trip-tabs__btn--table" href="#">Table</a>
  <a class="trip-tabs__btn" id="trip-tabs__btn--stats" href="#">Stats</a>
  </nav>`);
};
class MainNavComponent extends AbstractComponent {
  getTemplate() {
    return createMainNavTemplate();
  }

  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);
    const activeItem = this.getElement().querySelector(`.trip-tabs__btn--active`);
    if (item) {
      activeItem.classList.remove(`trip-tabs__btn--active`);
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  setOnClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.id;

      handler(menuItem);
    });
  }
}
export {MenuItem, MainNavComponent};

