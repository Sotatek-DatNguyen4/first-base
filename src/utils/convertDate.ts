import moment from 'moment';

export const convertUnixTimeToDateTime = (time: number) => {
  return moment.unix(time).format('hh:mm:ss A MM/DD/yyyy');
};

export const convertDateTimeToUnix = (time: any): string => {
  if (!time) {
    return '';
  }
  const unixTime = moment(time).format("x");
  return moment(time).format('x').substring(0, unixTime.length - 3);
};
