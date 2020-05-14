import {MainInfoComponent} from "../components/main-info.js";
import {getFirstDayOfRoute, getLastDayOfRoute, getFirstMonthOfRoute,
  getLastMonthOfRoute, getTotalCost, getAllCityOnRoute} from "../utils/info.js"
import {replace, render, RenderPosition} from "../utils/render.js";

export class MainInfoController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._mainInfoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allEvents = this._eventsModel.getEventsAll();
    const routeData = {
      firstDayOfRoute: getFirstDayOfRoute(allEvents),
      lastDayOfRoute: getLastDayOfRoute(allEvents),
      startMonthOfRoute: getFirstMonthOfRoute(allEvents),
      endMonthOfRoute: getLastMonthOfRoute(allEvents),
      totalCost: getTotalCost(allEvents),
      allCityOnRoute: getAllCityOnRoute(allEvents),
    };
    const oldComponent = this._mainInfoComponent;

    this._mainInfoComponent = new MainInfoComponent(routeData);

    if (oldComponent) {
      replace(this._mainInfoComponent, oldComponent);
    } else {
      render(container, this._mainInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}