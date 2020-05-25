import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getEventsNamesOfRoute, getExpensesOnEveryEventType,
  getCountOfEachEventType, getTimeOfEachEventType} from "../utils/chart.js";
import {getRoutePointWithUpperFirstLetter} from "../utils/common.js";
import {TypeIcon, ChartType} from "../components/constants.js";

const ChartParameter = {
  TYPE: `horizontalBar`,
  BACKGROUND_COLOR: `#ffffff`,
  MIN_BAR_LENGTH: 50,
  BAR_THICKNESS: 44,
  BAR_HEIGHT: 55,
  ANCHOR: `start`,
  OPTION_ANCHOR: `end`,
  ALIGN: `start`,
  FONT_COLOR: `#000000`,
  FONT_SIZE: 13,
  PADDING: 5,
  TITLE_SIZE: 23,
  TITLE_POSITION: `left`,
};

const GetChartValSimbol = {
  'MONEY': (val) => `€ ${val}`,
  'TRANSPORT': (val) => `${val}x`,
  'TIME SPENT': (val) => `${val}H`
};

const generateChartConfig = (types, dataOfChart, chartType) => {
  return {
    plugins: [ChartDataLabels],
    type: ChartParameter.TYPE,
    data: {
      labels: types,
      datasets: [{
        data: dataOfChart,
        backgroundColor: ChartParameter.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartParameter.BACKGROUND_COLOR,
        anchor: ChartParameter.ANCHOR,
        minBarLength: ChartParameter.MIN_BAR_LENGTH,
        barThickness: ChartParameter.BAR_THICKNESS,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartParameter.FONT_SIZE
          },
          color: ChartParameter.FONT_COLOR,
          anchor: ChartParameter.OPTION_ANCHOR,
          align: ChartParameter.ALIGN,
          formatter: GetChartValSimbol[chartType],
        }
      },
      title: {
        display: true,
        text: `${chartType}`,
        fontColor: ChartParameter.FONT_COLOR,
        fontSize: ChartParameter.TITLE_SIZE,
        position: ChartParameter.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ChartParameter.FONT_COLOR,
            padding: ChartParameter.PADDING,
            fontSize: ChartParameter.FONT_SIZE,
            callback: (type) => {
              return `${TypeIcon[type]} ${getRoutePointWithUpperFirstLetter(type)}`;
            }
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
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

  moneyCtx.height = ChartParameter.BAR_HEIGHT * allEventsTypes.length;

  return new Chart(moneyCtx, generateChartConfig(allEventsTypes, eventTypeExpenses, ChartType.MONEY));
};

const renderTransportChart = (transportCtx, events, allEventsTypes) => {
  const countOfEachEventType = getCountOfEachEventType(events, allEventsTypes);

  transportCtx.height = ChartParameter.BAR_HEIGHT * allEventsTypes.length;

  return new Chart(transportCtx, generateChartConfig(allEventsTypes, countOfEachEventType, ChartType.TRANSPORT));
};

const renderTimeSpentChart = (timeSpendCtx, events, allEventsTypes) => {
  const timeOfEachEventType = getTimeOfEachEventType(events, allEventsTypes);
  timeSpendCtx.height = ChartParameter.BAR_HEIGHT * allEventsTypes.length;

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

  recoveryListeners() {}
}

