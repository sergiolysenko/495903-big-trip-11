import {AbstractComponent} from "./abstractComponent.js";

const generateCitiesRoute = (citiesList) => {
  switch (citiesList.length) {
    case 1:
      return `<h1 class="trip-info__title">${citiesList[0]}</h1>`;
    case 2:
      return `<h1 class="trip-info__title">${citiesList[0]} 
      &mdash; ${citiesList[1]} </h1>`;
    case 3:
      return `<h1 class="trip-info__title">${citiesList[0]} 
      &mdash; ${citiesList[1]} &mdash; ${citiesList[2]}</h1>`;
    default:
      return `<h1 class="trip-info__title">${citiesList[0]} 
      &mdash; ... &mdash; ${citiesList[citiesList.length - 1]}</h1>`;
  }
};

const createMainInfoTemplate = (routeData) => {
  const {firstDayOfRoute, lastDayOfRoute, startMonthOfRoute,
    endMonthOfRoute, totalCost, allCityOnRoute} = routeData;

  const isOneMonthRoute = startMonthOfRoute === endMonthOfRoute;

  return (`<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
      ${generateCitiesRoute(allCityOnRoute)}
        ${isOneMonthRoute ?
      `<p class="trip-info__dates">${startMonthOfRoute}
        ${firstDayOfRoute}&nbsp;&mdash;&nbsp;${lastDayOfRoute}</p>`
      :
      `<p class="trip-info__dates">
      ${firstDayOfRoute} ${startMonthOfRoute}&nbsp;&mdash;&nbsp;${lastDayOfRoute} ${endMonthOfRoute}</p>`
    }
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p> 
    </section>`);
};

export class MainInfoComponent extends AbstractComponent {
  constructor(routeData) {
    super();
    this._routeData = routeData;
  }
  getTemplate() {
    return createMainInfoTemplate(this._routeData);
  }
}
