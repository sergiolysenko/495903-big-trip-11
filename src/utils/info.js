import {formatMonth} from "./common.js";

const getSortedEventsByDay = (events) => {
  const eventsCopy = events.slice();
  return eventsCopy.sort((a, b) => a.startTime - b.startTime);
};

const getFirstDayOfRoute = (events) => {
  if (!events.length) {
    return ``;
  }
  const sortedByFirstDay = getSortedEventsByDay(events);
  const firstDayOfRoute = sortedByFirstDay[0].startTime.getDate();
  return firstDayOfRoute;
};

const getLastDayOfRoute = (events) => {
  if (!events.length) {
    return ``;
  }
  const sortedByFirstDay = getSortedEventsByDay(events);
  const lastDayOfRoute = sortedByFirstDay.pop().endTime.getDate();
  return lastDayOfRoute;
};

const getFirstMonthOfRoute = (events) => {
  if (!events.length) {
    return ``;
  }
  const sortedByFirstDay = getSortedEventsByDay(events);
  const firstMonthOfRoute = sortedByFirstDay[0].startTime.getMonth();
  return formatMonth(firstMonthOfRoute);
};

const getLastMonthOfRoute = (events) => {
  if (!events.length) {
    return ``;
  }
  const sortedByFirstDay = getSortedEventsByDay(events);
  const lastMonthOfRoute = sortedByFirstDay.pop().endTime.getMonth();
  return formatMonth(lastMonthOfRoute);
};

const getOffersCost = (event) => {
  if (!event) {
    return ``;
  }
  return event.offers.reduce((sum, offer) => sum + offer.price, 0);
};

const getTotalCost = (events) => {
  if (!events.length) {
    return ``;
  }
  const offersCost = events.reduce((sum, event) => sum + getOffersCost(event), 0);
  const eventPrice = events.reduce((sum, event) => sum + Number(event.price), 0);
  return offersCost + eventPrice;
};

const getAllCityOnRoute = (events) => {
  if (!events.length) {
    return [];
  }
  const sortedByFirstDay = getSortedEventsByDay(events);
  const citiesList = sortedByFirstDay.map((event) => event.city.name);
  return citiesList;
};

export {getFirstDayOfRoute, getLastDayOfRoute,
  getFirstMonthOfRoute, getLastMonthOfRoute,
  getTotalCost, getAllCityOnRoute};
