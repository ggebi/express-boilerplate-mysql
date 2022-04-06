import moment from 'moment';

export const getDates = (from, to, intervalDay) => {
  const dateArr = [];
  const fromTime = moment(from).utc();
  const toTime = moment(to).utc();
  let current = fromTime;

  while (current.isBefore(toTime)) {
    dateArr.push(current.format('YYYY-MM-DD'));
    current = current.add(intervalDay, 'days');
  }
  return dateArr;
};

export const getHours = (from, to, intervalHour) => {
  const hourArr = [];
  const fromTime = moment(from).utc();
  const toTime = moment(to).utc();
  let current = fromTime;

  while (current.isBefore(toTime)) {
    hourArr.push(current.format('YYYY-MM-DD hh'));
    current = current.add(intervalHour, 'hours');
  }
  return hourArr;
};

export const zerofill = (xArr, vArr, rangeUnit) => {
  const arr = [];
  const unit = rangeUnit === 'd' ? 'day' : 'hour';
  const valueArr = vArr;

  // eslint-disable-next-line no-restricted-syntax
  for (const x of xArr) {
    if (
      !valueArr[0] ||
      moment(x).utc().isSame(moment(valueArr[0].time).utc(), unit)
    ) {
      arr.push(0);
    } else {
      arr.push(valueArr[0].value);
      valueArr.shift();
    }
  }

  return arr;
};
