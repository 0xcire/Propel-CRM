import { Get, handleAPIResponse } from '@/lib/fetch';
import type { AnalyticsDataResponse, AnalyticsYearsResponse } from '../types';

export const getSalesVolumeData = (): Promise<AnalyticsDataResponse> => {
  return Get({ endpoint: `analytics/sales?year=2023` }).then(
    handleAPIResponse<AnalyticsDataResponse>
  );
};

export const getSalesYearsData = (): Promise<AnalyticsYearsResponse> => {
  return Get({ endpoint: 'analytics/years' }).then(
    handleAPIResponse<AnalyticsYearsResponse>
  );
};
