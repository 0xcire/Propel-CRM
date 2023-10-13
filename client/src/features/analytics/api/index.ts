import { Get, handleAPIResponse } from '@/lib/fetch';
import type {
  AnalyticsDataResponse,
  AnalyticsDaysOnMarketResponse,
  AnalyticsYearsResponse,
} from '../types';

export const getSalesVolumeData = (
  userID: number
): Promise<AnalyticsDataResponse> => {
  return Get({ endpoint: `analytics/sales/${userID}?year=2023/` }).then(
    handleAPIResponse<AnalyticsDataResponse>
  );
};

export const getSalesYearsData = (): Promise<AnalyticsYearsResponse> => {
  return Get({ endpoint: 'analytics/years' }).then(
    handleAPIResponse<AnalyticsYearsResponse>
  );
};

export const getAvgDaysOnMarket = (
  userID: number
): Promise<AnalyticsDaysOnMarketResponse> => {
  return Get({ endpoint: `analytics/days-on-market/${userID}` }).then(
    handleAPIResponse<AnalyticsDaysOnMarketResponse>
  );
};
