import { quarters } from '../config';

import type { BaseResponse } from '@/types';

export type Quarters = (typeof quarters)[number];

export type AnalyticsDataPoint = {
  month: string;
  value: string;
};

export type SalesVolumes = Array<AnalyticsDataPoint>;

export type DaysOnMarketData = Array<AnalyticsDataPoint>;
export type ListToSaleRatioData = Array<AnalyticsDataPoint>;
export type TimeToCloseData = Array<AnalyticsDataPoint>;

export type Years = Array<string>;

export interface AnalyticsSalesVolumeResponse extends BaseResponse {
  volumes: SalesVolumes;
}

export interface AnalyticsYearsResponse extends BaseResponse {
  years: Years;
}

export interface AnalyticsDaysOnMarketResponse extends BaseResponse {
  averages: DaysOnMarketData;
}

export interface AnalyticsListToSaleRatioResponse extends BaseResponse {
  ratios: ListToSaleRatioData;
}

export interface AnalyticsTimeToCloseResponse extends BaseResponse {
  days: TimeToCloseData;
}
