import { Get, handleAPIResponse } from '@/lib/fetch';
import { AnalyticsResponse } from '../types';

export const getSalesVolumeData = (): Promise<AnalyticsResponse> => {
  return Get({ endpoint: 'analytics/sales' }).then(
    handleAPIResponse<AnalyticsResponse>
  );
};
