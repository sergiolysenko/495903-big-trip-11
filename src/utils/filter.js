import {isFutureEvent, isPastEvent} from "./common.js";
import {FiltersType} from "../components/constants.js";

const getFutureEvents = (events, nowDate) => {
  return events.filter((event) => isFutureEvent(event.startTime, nowDate));
};
const getPastEvents = (events, nowDate) => {
  return events.filter((event) => isPastEvent(event.endTime, nowDate));
};

const getEventsByFilter = (events, filtersType) => {
  const nowDate = new Date();
  switch (filtersType) {
    case FiltersType.FUTURE:
      return getFutureEvents(events, nowDate);
    case FiltersType.PAST:
      return getPastEvents(events, nowDate);
    case FiltersType.EVERYTHING:
      return events;
  }
  return events;
};

export {getEventsByFilter};

