import {MONTH_NAMES} from "./constants.js";

const randomNumder = (min, max) => {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDate = (date) => {
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth());
  const year = date.getFullYear().toString().substring(2);
  return `${day}/${month}/${year}`;
};

const formatMonth = (month) => `${MONTH_NAMES[month]}`;

const routePointDuration = (start, end) => {
  const duarionMinutes = end.getMinutes() - start.getMinutes();
  const isMinNegative = duarionMinutes < 0;
  const minutes = isMinNegative ? 60 + duarionMinutes : duarionMinutes;
  const durationHour = isMinNegative ? end.getHours() - start.getHours() - 1 : end.getHours() - start.getHours();
  const isHourNegative = durationHour < 0;
  const hours = isHourNegative ? 24 + durationHour : durationHour;
  const durationDayTemp = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  const durationDay = isHourNegative ? durationDayTemp - 1 : durationDayTemp;
  const isPartShoing = (time, letter) => time === 0 ? `` : time + letter;
  const date = `${isPartShoing(durationDay, `D`)} ${isPartShoing(hours, `H`)} ${isPartShoing(minutes, `M`)}`;
  return date;
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

export {randomNumder, formatTime, formatDate,
  routePointDuration, structureEventsByDays, formatMonth};
