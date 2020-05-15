import {routePointDurationInHours} from "./common.js";

const getEventsNamesOfRoute = (events) => {
  const allEventsNames = [];
  events.forEach((event) => {
    if (!allEventsNames.includes(event.eventType)) {
      allEventsNames.push(event.eventType);
    }
  });
  return allEventsNames;
};

const getExpensesOnEveryEventType = (events, eventsTypesOfRoute) => {
  return eventsTypesOfRoute.map((eventType) => {
    return events.filter((event) => event.eventType === eventType)
    .reduce((sum, event) => sum + +event.price, 0);
  });
};

const getCountOfEachEventType = (events, eventsTypesOfRoute) => {
  return eventsTypesOfRoute.map((eventType) => {
    return events.filter((event) => event.eventType === eventType).length;
  });
};

const getTimeOfEachEventType = (events, eventsTypesOfRoute) => {
  return eventsTypesOfRoute.map((eventType) => {
    return events.filter((event) => event.eventType === eventType)
    .reduce((sum, event) => sum + +routePointDurationInHours(event.startTime, event.endTime), 0);
  });
};

export {getEventsNamesOfRoute, getExpensesOnEveryEventType,
  getCountOfEachEventType, getTimeOfEachEventType};
