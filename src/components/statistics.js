import AbstractSmartComponent from "./abstractSmartComponent.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getEventsNamesOfRoute, getExpensesOnEveryEventType,
  getCountOfEachEventType, getTimeOfEachEventType} from "../utils/chart.js";
import {getRoutePointWithUpperFirstLetter} from "../utils/common.js";

import {BAR_HEIGHT, TypeIcon, ChartType} from "../components/constants.js";

const GetChartValSimbol = {
  'MONEY': (val) => `€ ${val}`,
  'TRANSPORT': (val) => `${val}x`,
  'TIME SPENT': (val) => `${val}H`
};

const generateChartConfig = (types, dataOfChart, chartType) => {
  return {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: dataOfChart,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: GetChartValSimbol[chartType],
        }
      },
      title: {
        display: true,
        text: `${chartType}`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 15,
            callback: (type) => {
              return `${TypeIcon[type]} ${getRoutePointWithUpperFirstLetter(type)}`;
            }
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  };
};

const createStatisticsTemplate = () => {
  return (`<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`);
};

const renderMoneyChart = (moneyCtx, events, allEventsTypes) => {
  const eventTypeExpenses = getExpensesOnEveryEventType(events, allEventsTypes);

  moneyCtx.height = BAR_HEIGHT * allEventsTypes.length;

  return new Chart(moneyCtx, generateChartConfig(allEventsTypes, eventTypeExpenses, ChartType.MONEY));
};

const renderTransportChart = (transportCtx, events, allEventsTypes) => {
  const countOfEachEventType = getCountOfEachEventType(events, allEventsTypes);

  transportCtx.height = BAR_HEIGHT * allEventsTypes.length;

  return new Chart(transportCtx, generateChartConfig(allEventsTypes, countOfEachEventType, ChartType.TRANSPORT));
};

const renderTimeSpentChart = (timeSpendCtx, events, allEventsTypes) => {
  const timeOfEachEventType = getTimeOfEachEventType(events, allEventsTypes);
  timeSpendCtx.height = BAR_HEIGHT * allEventsTypes.length;

  return new Chart(timeSpendCtx, generateChartConfig(allEventsTypes, timeOfEachEventType, ChartType.TIME_SPENT));
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();

    this._events = eventsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._events);
  }

  recoveryListeners() {}

  rerender(events) {
    this._events = events;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const events = this._events.getEventsAll();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);
    const allEventsNames = getEventsNamesOfRoute(events);

    this._resetCharts();
    this._moneyChart = renderMoneyChart(moneyCtx, events, allEventsNames);
    this._transportChart = renderTransportChart(transportCtx, events, allEventsNames);
    this._timeSpendChart = renderTimeSpentChart(timeSpendCtx, events, allEventsNames);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}

