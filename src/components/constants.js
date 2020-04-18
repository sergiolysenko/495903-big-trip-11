const routePoints = {
  transfer: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
  activities: [`Check-in`, `Sightseeing`, `Restaurant`],
};

const cities = [`Amsterdam`, `Moscow`, `Bruge`, `Paris`, `Boston`];
const offersItems = [
  {
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


export {routePoints, cities, offersItems, MONTH_NAMES};
