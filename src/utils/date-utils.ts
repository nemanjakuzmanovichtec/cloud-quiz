const makeDateUtils = () => {
  const addHoursToDate = (date: Date, hours: number): Date => {
    return new Date(new Date(date).setUTCHours(date.getUTCHours() + hours));
  };

  const getSecondsSinceEpoch = (date: Date) => {
    return Math.floor(date.getTime() / 1000);
  };

  return { addHoursToDate, getSecondsSinceEpoch };
};

const DateUtils = makeDateUtils();

export { DateUtils };
