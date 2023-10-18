import { Get, handleAPIResponse } from '@/lib/fetch';

import type {
  AnalyticsSalesVolumeResponse,
  AnalyticsDaysOnMarketResponse,
  AnalyticsListToSaleRatioResponse,
  AnalyticsTimeToCloseResponse,
  AnalyticsYearsResponse,
} from '../types';

export const getSalesVolumeData = (
  userID: number
): Promise<AnalyticsSalesVolumeResponse> => {
  return Get({
    endpoint: `analytics/sales/${userID}${window.location.search}`,
  }).then(handleAPIResponse<AnalyticsSalesVolumeResponse>);
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

export const getListToSaleRatio = (
  userID: number
): Promise<AnalyticsListToSaleRatioResponse> => {
  return Get({
    endpoint: `analytics/list-sale-ratio/${userID}${window.location.search}`,
  }).then(handleAPIResponse<AnalyticsListToSaleRatioResponse>);
};

export const getAvgTimeToCloseLead = (
  userID: number
): Promise<AnalyticsTimeToCloseResponse> => {
  return Get({
    endpoint: `analytics/time-to-close/${userID}${window.location.search}`,
  }).then(handleAPIResponse<AnalyticsTimeToCloseResponse>);
};
