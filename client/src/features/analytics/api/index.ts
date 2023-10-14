import { Get, handleAPIResponse } from '@/lib/fetch';
import type {
  AnalyticsDataResponse,
  AnalyticsDaysOnMarketResponse,
  AnalyticsYearsResponse,
} from '../types';

export const getSalesVolumeData = (
  userID: number
): Promise<AnalyticsDataResponse> => {
  return Get({
    endpoint: `analytics/sales/${userID}${window.location.search}`,
  }).then(handleAPIResponse<AnalyticsDataResponse>);
};

export const getSalesYearsData = (
  userID: number
): Promise<AnalyticsYearsResponse> => {
  return Get({
    endpoint: `analytics/years/${userID}`,
  }).then(handleAPIResponse<AnalyticsYearsResponse>);
};

export const getAvgDaysOnMarket = (
  userID: number
): Promise<AnalyticsDaysOnMarketResponse> => {
  return Get({
    endpoint: `analytics/days-on-market/${userID}${window.location.search}`,
  }).then(handleAPIResponse<AnalyticsDaysOnMarketResponse>);
};
