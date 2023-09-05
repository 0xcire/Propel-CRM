import { BaseResponse } from '@/types';

export type SalesVolume = Array<{
  month: string;
  volume: number;
}>;

export type Years = Array<string>;

export interface AnalyticsDataResponse extends BaseResponse {
  analytics: SalesVolume;
}

export interface AnalyticsYearsResponse extends BaseResponse {
  years: Years;
}
