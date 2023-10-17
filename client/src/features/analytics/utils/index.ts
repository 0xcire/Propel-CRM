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
