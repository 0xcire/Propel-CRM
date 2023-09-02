import { BaseResponse } from '@/types';

export type SalesVolume = Array<{
  month: string;
  monthVolume: number;
}>;

export interface AnalyticsResponse extends BaseResponse {
  analytics: SalesVolume;
}
