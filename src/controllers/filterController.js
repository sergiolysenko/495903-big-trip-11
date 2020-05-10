import {FiltersType} from "../components/constants.js";
import {MainFilterComponent} from "../components/main-filter.js";
import {RenderPosition, render, replace} from "../utils/render.js";

class FilterController {
  constructor(container, eventModel) {
    this._container = container;
    this._eventModel = eventModel;

    this._activeFilterType = FiltersType.EVERYTHING;
    this._filterComponent = null;
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  render() {
    const container = this._container;

    const filters = Object.values(FiltersType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;
    this._filterComponent = new MainFilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._eventModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}

export {FilterController};
