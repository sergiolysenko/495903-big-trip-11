import {formatMonth} from "./common.js";

const getSortedEventsByDay = (events) => {
  const eventsCopy = events.slice();
  return eventsCopy.sort((a, b) => a.startTime - b.startTime);
};

const getFirstDayOfRoute = (events) => {
  const sortedByFirstDay = getSortedEventsByDay(events);
  const firstDayOfRoute = sortedByFirstDay[0].startTime.getDate();
  return firstDayOfRoute;
};

const getLastDayOfRoute = (events) => {
  const sortedByFirstDay = getSortedEventsByDay(events);
  const lastDayOfRoute = sortedByFirstDay[sortedByFirstDay.length - 1].endTime.getDate();
  return lastDayOfRoute;
};

const getFirstMonthOfRoute = (events) => {
  const sortedByFirstDay = getSortedEventsByDay(events);
  const firstMonthOfRoute = sortedByFirstDay[0].startTime.getMonth();
  return formatMonth(firstMonthOfRoute);
};

const getLastMonthOfRoute = (events) => {
  const sortedByFirstDay = getSortedEventsByDay(events);
  const lastMonthOfRoute = sortedByFirstDay[sortedByFirstDay.length - 1].endTime.getMonth();
  return formatMonth(lastMonthOfRoute);
};

const getTotalCost = (events) => {
  return events.reduce((sum, event) => sum + +event.price, 0);
};

const getAllCityOnRoute = (events) => {
  const sortedByFirstDay = getSortedEventsByDay(events);
  const citiesList = sortedByFirstDay.map((event) => event.city);
  return citiesList;
};

export {getFirstDayOfRoute, getLastDayOfRoute,
  getFirstMonthOfRoute, getLastMonthOfRoute,
  getTotalCost, getAllCityOnRoute};
