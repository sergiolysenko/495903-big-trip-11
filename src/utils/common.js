import {MONTH_NAMES} from "../components/constants.js";
import moment from "moment";

const randomNumder = (min, max) => {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
};

const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

const formatDate = (date) => {
  return moment(date).format(`dd/mm/yy`);
};

const formatMonth = (month) => `${MONTH_NAMES[month]}`;

const routePointDuration = (start, end) => {
  const difference = moment.utc(moment(end).diff(moment(start)));
  const diffInHours = moment(difference).format(`H`);
  const diffInMin = moment(difference).format(`mm`);
  const diffInDays = Math.floor(moment.duration(difference).asDays());
  const isDayDiff = diffInDays >= 1 ? diffInDays + `D` : ``;
  const isHoursDiff = diffInHours > 0 ? diffInHours + `H` : ``;
  const isMinDiff = diffInMin > 0 ? diffInMin + `M` : ``;
  return isDayDiff + ` ` + isHoursDiff + ` ` + isMinDiff;
};

const routePointDurationInHours = (start, end) => {
  const startTime = moment(start);
  const endTime = moment(end);
  return endTime.diff(startTime, `hours`);
};

const structureEventsByDays = (eventsList) => {
  let arrForDays = new Array(``);

  eventsList.forEach((eventItem) => {
    let found = true;
    let dayNum = 0;
    const eventDate = eventItem.startTime.getDate();
    const eventMonth = eventItem.startTime.getMonth();
    const eventYear = eventItem.startTime.getFullYear();

    for (let dayObj of arrForDays) {
      if (dayObj.day === eventDate
        && dayObj.events[0].startTime.getMonth() === eventMonth
        && dayObj.events[0].startTime.getFullYear() === eventYear) {
        dayObj.events.push(eventItem);
        found = true;
      } else {
        found = false;
        dayNum++;
      }
    }
    if (!found) {
      arrForDays.push(
          {
            day: eventDate,
            month: eventMonth,
            year: eventYear,
            dayNumber: dayNum,
            events: new Array(eventItem),
          });
    }
  });
  arrForDays.shift();
  return arrForDays;
};

const isFutureEvent = (startDate, dateNow) => {
  return startDate > dateNow;
};

const isPastEvent = (endDate, dateNow) => {
  return endDate < dateNow;
};

const getRoutePointWithUpperFirstLetter = (routePoint) => {
  return routePoint[0].toUpperCase() + routePoint.slice(1);
};

export {randomNumder, formatTime, formatDate,
  routePointDuration, structureEventsByDays,
  formatMonth, isFutureEvent, isPastEvent,
  getRoutePointWithUpperFirstLetter, routePointDurationInHours};
