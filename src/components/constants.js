const routePoints = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activities: [`check-in`, `sightseeing`, `restaurant`],
};

const TypeIcon = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🚢`,
  'transport': `🚙`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛️`,
  'restaurant': `🍴`
};

const ChartType = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPENT: `TIME SPENT`,
};

const BAR_HEIGHT = 55;

const cities = [`Amsterdam`, `Moscow`, `Bruge`, `Paris`, `Boston`];
const offersItems = [
  {
    type: `taxi`,
    offers: [{
      type: `uber`,
      title: `Order Uber`,
      price: 20,
    }],
  },
  {
    type: `drive`,
    offers: [{
      type: `rent`,
      title: `Rent a car`,
      price: 200,
    }],
  },
  {
    type: `flight`,
    offers: [{
      type: `luggage`,
      title: `Add luggage`,
      price: 30,
    },
    {
      type: `comfort`,
      title: `Switch to comfort class`,
      price: 100,
    },
    {
      type: `meal`,
      title: `Add meal`,
      price: 15,
    },
    {
      type: `seats`,
      title: `Choose seats`,
      price: 5,
    },
    {
      type: `train`,
      title: `Travel by train`,
      price: 40,
    }],
  },
  {
    type: `sightseeing`,
    offers: [{
      type: `tickets`,
      title: `Book tickets`,
      price: 40,
    },
    {
      type: `lunch`,
      title: `Lunch in city`,
      price: 30,
    }],
  }];


const MONTH_NAMES = [
  `JAN`,
  `FEB`,
  `MAR`,
  `APR`,
  `MAY`,
  `JUN`,
  `JUL`,
  `AUG`,
  `SEP`,
  `OCT`,
  `NOV`,
  `DEC`,
];

const FiltersType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export {routePoints, cities, offersItems,
  BAR_HEIGHT, MONTH_NAMES, FiltersType, TypeIcon, ChartType};
