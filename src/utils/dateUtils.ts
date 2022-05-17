export const addHoursToDate = (date: Date, hours: number): Date => {
  return new Date(new Date(date).setUTCHours(date.getUTCHours() + hours));
};

export const getSecondsSinceEpoch = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};
