const { 
  GREEN_DAYS_OF_THE_MONTH,
  GREEN_DAY_OF_WEEK, 
  NUMBER_OF_DAYS_TO_CHECK, 
  LAST_DAY_OF_THE_WEED,
  EXTERNAL_PRODUCT_DELIVERY_DAYS,
  EXTERNAL_PRODUCT_TYPE,
  TEMPORARY_PRODUCT_TYPE,
  DAY_CONVERTER,
  SORTING_DAYS 
 } = require('./constants');

 /**
  *  description: checks if a given date is a green delivery day
  * @param {*} date 
  * @returns 
  */
const isGreenDelivery = (date) =>{
  return date.getDay() === GREEN_DAY_OF_WEEK || GREEN_DAYS_OF_THE_MONTH.includes(date.getDate());
}

/**
 * description: returns the number of days left in the week
 * @param {*} date 
 * @returns number of days left in the week
 */
const daysLeftInTheWeek = (date) => {
  return LAST_DAY_OF_THE_WEED - date.getDay();
}

/**
 * 
 * @param {*} postalCode 
 * @param {*} products 
 * @param {*} providedDate 
 * @returns Array of delivery dates
 */
const availableDeliveryDates = (postalCode, products, providedDate) => {
  let deliveryDates = [];
  if(!postalCode) throw new Error('Postal code is required');
  if(!products || !products.length) throw new Error('Products are required');
  if(!providedDate) throw new Error('Date is required');
  if(isNaN(new Date(providedDate).getTime())) throw new Error('The provided date is missing or invalid');
  for (let day = 0; day <  NUMBER_OF_DAYS_TO_CHECK; day++) {
    const date = new Date(providedDate);
      date.setDate(date.getDate() + day);
      let isDeliveryDayValid = true;

      for (let product of products) {
        const availableDeliveryDatesConditions = 
        product && 
          (!product.deliveryDays.includes(date.getDay()) ||
          (product.productType === EXTERNAL_PRODUCT_TYPE && day < EXTERNAL_PRODUCT_DELIVERY_DAYS) ||
          (product.productType === TEMPORARY_PRODUCT_TYPE && day > daysLeftInTheWeek(providedDate)) ||
          day < product.daysInAdvance);
          if ( availableDeliveryDatesConditions) {
              isDeliveryDayValid = false;
              break;
          }
          // const externalProductTypeCondition = product.productType === EXTERNAL_PRODUCT_TYPE && day < EXTERNAL_PRODUCT_DELIVERY_DAYS;
          // if (product && externalProductTypeCondition) {
          //   console.log(`Product ${product.name},  (external) cannot be delivered until after day: ${EXTERNAL_PRODUCT_DELIVERY_DAYS}`);
          //     isDeliveryDayValid = false;
          //     break;
          // }
          // const temporaryProductTypeCondition = product.productType === TEMPORARY_PRODUCT_TYPE && day > daysLeftInTheWeek(providedDate);
          // if (product && temporaryProductTypeCondition) {
          //   console.log(day)
          //   console.log(`Product ${product.name} (temporary) cannot be delivered until after day:" ${daysLeftInTheWeek(providedDate)}`);
          //     isDeliveryDayValid = false;
          //     break;
          // }

          // if (day < product.daysInAdvance) {
          //     isDeliveryDayValid = false;
          //     break;
          // }
      }

      if (isDeliveryDayValid) {
          let deliveryDate = {
              postalCode: postalCode,
              deliveryDate: date.toISOString(),
              isGreenDelivery: isGreenDelivery(date)
          };
          deliveryDates.push(deliveryDate);
      }
  }

  deliveryDates.sort((a, b) => {
    const dayDifferenceA = (new Date(a.deliveryDate) - providedDate) / DAY_CONVERTER;
    const dayDifferenceB = (new Date(b.deliveryDate) - providedDate) / DAY_CONVERTER;

    if (a.isGreenDelivery && dayDifferenceA <= SORTING_DAYS && (!b.isGreenDelivery || dayDifferenceB > SORTING_DAYS)) {
        return -1;
    } else if (b.isGreenDelivery && dayDifferenceB <= SORTING_DAYS && (!a.isGreenDelivery || dayDifferenceA > SORTING_DAYS)) {
        return 1;
    } else {
        return a.deliveryDate.localeCompare(b.deliveryDate);
    }
});

  return deliveryDates;
}

const products = [
  {
  productId: 1,
  name: 'Apple',
  deliveryDays: [1, 2, 3, 4, 5,6,0], 
  productType: 'external',
  daysInAdvance: 3
},
{
  productId: 2,
  name: 'Banana',
  deliveryDays: [1, 2, 3, 4, 5,6,0],
  productType: 'temporary',
  daysInAdvance: 1
},
{
  productId: 3,
  name: 'Orange',
  deliveryDays: [1, 2, 3, 4, 5],
  productType: 'normal',
}

];
const getDeliveryDates = availableDeliveryDates(14162, products, new Date('2023-08-21'));
console.log(getDeliveryDates, 'getDeliveryDates');
module.exports = {
  availableDeliveryDates,
  isGreenDelivery,
  daysLeftInTheWeek
}