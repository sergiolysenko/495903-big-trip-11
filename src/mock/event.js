import {routePoints, cities, offersItems} from "../components/constants.js";
import {randomNumder} from "../utils/common.js";

const generatePhotoList = () => {
  return new Array(randomNumder(1, 5)).fill(``).map(()=> {
    return `http://picsum.photos/248/152?r=${Math.random()}`;
  });
};

const routePointInfo = {
  descriptionText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Cras aliquet varius magna, non porta ligula feugiat eget.
  Fusce tristique felis at fermentum pharetra. 
  Aliquam id orci ut lectus varius viverra.
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
  Sed sed nisi sed augue convallis suscipit in sed felis. 
  Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. 
  In rutrum ac purus sit amet tempus.`,
  photo: generatePhotoList(),
};

const generateNextDate = (date) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + randomNumder(0, 0));
  nextDate.setHours(nextDate.getHours() + randomNumder(0, 12));
  nextDate.setMinutes(nextDate.getMinutes() + randomNumder(0, 60));
  return nextDate;
};

let startDay = new Date();

const generateEvent = () => {
  const descriptionArr = routePointInfo.descriptionText.split(`. `);
  const {transfer, activities} = routePoints;
  startDay = generateNextDate(startDay);
  let endDay = generateNextDate(startDay);
  return {
    eventType: Math.random() > 0.5 ? transfer[randomNumder(0, transfer.length - 1)]
      : activities[randomNumder(0, activities.length - 1)],
    city: cities[randomNumder(0, cities.length - 1)],
    startTime: startDay,
    endTime: endDay,
    price: randomNumder(10, 1500),
    isFavorite: Math.random() < 0.5,
    offers: Math.random() > 0.5 ? offersItems.slice(0, randomNumder(0, offersItems.length - 1)) : ``,
    description: descriptionArr.slice(0, randomNumder(1, descriptionArr.length - 1)).join(` `),
    photo: routePointInfo.photo,
    dayRoute: true,
  };
};

const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};
export {generateEvents};

