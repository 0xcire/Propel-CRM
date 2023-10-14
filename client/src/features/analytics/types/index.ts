import { quarters } from '../config';

import type { BaseResponse } from '@/types';

export type Quarters = (typeof quarters)[number];

export type SalesVolume = {
  month: string;
  volume: string;
};

export type SalesVolumes = Array<SalesVolume>;

export type DaysOnMarket = Array<{
  month: string;
  average: string;
}>;

export type Years = Array<string>;

export interface AnalyticsDataResponse extends BaseResponse {
  analytics: SalesVolumes;
}

export interface AnalyticsYearsResponse extends BaseResponse {
  years: Years;
}

export interface AnalyticsDaysOnMarketResponse extends BaseResponse {
  averages: DaysOnMarket;
}
