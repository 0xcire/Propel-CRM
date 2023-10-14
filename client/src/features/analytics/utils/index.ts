import { timeFrameMap } from '../config';

import type { Quarters } from '../types';

export const filterAnalyticsData = <T>(
  data: Array<T>,
  currentTimeFrame: Quarters
): Array<T> => {
  return currentTimeFrame === 'YTD'
    ? data
    : data.slice(...timeFrameMap[currentTimeFrame]);
};
