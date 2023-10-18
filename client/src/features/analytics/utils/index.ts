import { timeFrameMap } from '../config';

import type { Quarters } from '../types';

export const filterAnalyticsData = <T>(
  data: Array<T>,
  currentTimeFrame: Quarters
): Array<T> => {
  return currentTimeFrame === 'year'
    ? data
    : data.slice(...timeFrameMap[currentTimeFrame]);
};

type GetMinMaxCallback = () => Array<number> | undefined;

// take various shapes of analytics data, map to array of numbers, return min max tuple
export const getMinMax = (
  callback: GetMinMaxCallback
): readonly [number, number] | undefined => {
  const data = callback();
  if (!data) return;

  return [Math.min(...data), Math.max(...data)] as const;
};

type calculateAverageParams = {
  data: Array<unknown> | undefined;
  getValues: (data: unknown) => number;
  currentTimeFrame: Quarters;
  percentage?: boolean;
};

export const calculateAverage = ({
  data,
  getValues,
  currentTimeFrame,
  percentage,
}: calculateAverageParams): string => {
  // handle initial query / a fresh user, for ex
  if (!data || data.length === 0) {
    return `0${percentage ? '%' : ''}`;
  }

  const filteredData = filterAnalyticsData(data, currentTimeFrame).filter(
    (data) => getValues(data) !== 0
  );

  // user may have data, but q4, for ex, could be empty
  if (filteredData.length === 0) {
    return `0${percentage ? '%' : ''}`;
  }

  const average =
    filteredData
      .map(getValues)
      .reduce((previous, current) => previous + current, 0) /
    filteredData.length;

  return percentage
    ? `${Math.floor(average * 100).toString()} %`
    : Math.floor(average).toString();
};
