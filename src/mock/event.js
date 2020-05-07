import {routePoints, cities, offersItems} from "../components/constants.js";
import {randomNumder} from "../utils/common.js";

const generatePhotoList = () => {
  return new Array(randomNumder(1, 5)).fill(``).map(()=> {
    return `http://picsum.photos/248/152?r=${Math.random()}`;
  });
};

const generateCitiesInfo = () => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Cras aliquet varius magna, non porta ligula feugiat eget.
  Fusce tristique felis at fermentum pharetra. 
  Aliquam id orci ut lectus varius viverra.
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
  Sed sed nisi sed augue convallis suscipit in sed felis. 
  Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. 
  In rutrum ac purus sit amet tempus.`;
  const descriptionArr = text.split(`. `);
  return cities.map((cityName) => {
    return {
      name: cityName,
      descriptionText: descriptionArr.slice(0, randomNumder(1, descriptionArr.length - 1)).join(` `),
      photo: generatePhotoList(),
    };
  });
};
const citiesInfo = generateCitiesInfo();
const generateNextDate = (date) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + randomNumder(0, 0));
  nextDate.setHours(nextDate.getHours() + randomNumder(0, 12));
  nextDate.setMinutes(nextDate.getMinutes() + randomNumder(0, 60));
  return nextDate;
};

let startDay = new Date();

const generateEvent = () => {
  const {transfer, activities} = routePoints;
  const cityInfo = citiesInfo[randomNumder(0, citiesInfo.length - 1)];
  startDay = generateNextDate(startDay);
  let endDay = generateNextDate(startDay);
  const randomEventType = Math.random() > 0.5 ? transfer[randomNumder(0, transfer.length - 1)]
    : activities[randomNumder(0, activities.length - 1)];
  const currentOfferGroup = randomEventType in offersItems ? offersItems[randomEventType] : false;
  return {
    eventType: randomEventType,
    city: cityInfo.name,
    startTime: startDay,
    endTime: endDay,
    price: randomNumder(10, 1500),
    isFavorite: Math.random() < 0.5,
    offers: currentOfferGroup ? currentOfferGroup.slice(0, randomNumder(0, currentOfferGroup.length)) : [],
    dayRoute: true,
  };
};

const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};
export {generateEvents, citiesInfo};

