import { BaseResponse } from '@/types';

export type SalesVolume = Array<{
  month: string;
  volume: string;
}>;

// export type DaysOnMarket = {
//   average: string;
// };

export type Years = Array<string>;

export interface AnalyticsDataResponse extends BaseResponse {
  analytics: SalesVolume;
}

export interface AnalyticsYearsResponse extends BaseResponse {
  years: Years;
}

export interface AnalyticsDaysOnMarketResponse extends BaseResponse {
  average: string;
}
