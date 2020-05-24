import AbstractComponent from "./abstract-component.js";

const CitiesCount = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
};

const IndexOfCity = {
  FIRST: 0,
  SECOND: 1,
  THIRD: 2,
};

const generateCitiesRoute = (citiesList) => {
  switch (citiesList.length) {
    case CitiesCount.ONE:
      return `<h1 class="trip-info__title">${citiesList[IndexOfCity.FIRST]}</h1>`;
    case CitiesCount.TWO:
      return `<h1 class="trip-info__title">${citiesList[IndexOfCity.FIRST]} 
      &mdash; ${citiesList[IndexOfCity.SECOND]} </h1>`;
    case CitiesCount.THREE:
      return `<h1 class="trip-info__title">${citiesList[IndexOfCity.FIRST]} 
      &mdash; ${citiesList[IndexOfCity.SECOND]} &mdash; ${citiesList[IndexOfCity.THIRD]}</h1>`;
    default:
      return `<h1 class="trip-info__title">${citiesList[IndexOfCity.FIRST]} 
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

export default class MainInfoComponent extends AbstractComponent {
  constructor(routeData) {
    super();
    this._routeData = routeData;
  }
  getTemplate() {
    return createMainInfoTemplate(this._routeData);
  }
}
