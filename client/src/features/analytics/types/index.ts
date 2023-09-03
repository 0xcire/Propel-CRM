import { BaseResponse } from '@/types';

export type SalesVolume = Array<{
  month: string;
  volume: number;
}>;

export interface AnalyticsResponse extends BaseResponse {
  analytics: SalesVolume;
}
