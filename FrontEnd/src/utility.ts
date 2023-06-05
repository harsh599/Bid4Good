const getTime = (datetimeString: string | Date) => {
  const datetime = new Date(datetimeString);
  const time = datetime
    .toLocaleTimeString(undefined, { hour12: false })
    .slice(0, -3);
  return time;
};

const getDate = (datetimeString: string | Date) => {
  const datetime = new Date(datetimeString);
  const date = datetime.toISOString().slice(0, 10);
  return date;
};

export { getTime, getDate };
