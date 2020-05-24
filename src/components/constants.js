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

const MenuItem = {
  TABLE: `trip-tabs__btn--table`,
  STATS: `trip-tabs__btn--stats`,
};

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

const StoreGroup = {
  EVENTS: `events`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
};

export {routePoints,
  MONTH_NAMES, FiltersType, StoreGroup,
  MenuItem, TypeIcon, ChartType};
