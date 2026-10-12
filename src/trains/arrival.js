export const getArrivalDay = (train) =>
  train.arrivalDay || (train.arrival <= train.departure ? 2 : 1);

export const getArrivalDate = (train, date) => {
  const arrivalDate = new Date(date + "T00:00");
  arrivalDate.setDate(arrivalDate.getDate() + getArrivalDay(train) - 1);
  return arrivalDate.toLocaleDateString("en-CA");
};

export const formatArrival = (train, date) =>
  getArrivalDay(train) === 1
    ? train.arrival
    : `${train.arrival} (${getArrivalDate(train, date)})`;
