import {RenderPosition, render, replace} from "../utils/render.js";
import {EventItemComponent} from "../components/event-item.js";
import {EventItemEditComponent} from "../components/event-edit.js";

class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point) {
    this._eventComponent = new EventItemComponent(point);
    this._eventEditComponent = new EventItemEditComponent(point);

    this._eventEditComponent.setFavoritButtonClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setRollUpClickHandler(() => {
      this._closeEdit();
    });
    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._closeEdit();
    });

    render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
  }

  _replaceEventToEdit() {
    replace(this._eventEditComponent, this._eventComponent);
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
  }

  _closeEdit() {
    this._replaceEditToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeEdit();
    }
  }
}
export {PointController};
