import {AbstractComponent} from "./abstractComponent.js";

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

const createMainTripSortTemplate = (currentSortType) => {
  const isCurrentSortEvent = currentSortType === SortType.EVENT ? `Day` : ``;
  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      
      <span class="trip-sort__item  trip-sort__item--day">${isCurrentSortEvent}</span>
      
      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" checked>
        <label data-sort-type="${SortType.EVENT}" class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
        <label data-sort-type="${SortType.TIME}" class="trip-sort__btn" for="sort-time">
          Time
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
        <label data-sort-type="${SortType.PRICE}" class="trip-sort__btn" for="sort-price">
          Price
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`);
};

class MainTripSortComponent extends AbstractComponent {
  constructor() {
    super();
    this._currentTypeSort = SortType.EVENT;
  }

  getTemplate() {
    return createMainTripSortTemplate();
  }

  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;
      if (this._currentTypeSort === sortType) {
        return;
      }
      this._currentTypeSort = sortType;
      handler(this._currentTypeSort);
    });
  }
}

export {MainTripSortComponent, SortType};
