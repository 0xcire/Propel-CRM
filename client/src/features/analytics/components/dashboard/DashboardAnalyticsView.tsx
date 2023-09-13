import { AnalyticsProvider } from '../../context/AnalyticsContext';

import { DashboardItemHeader } from '@/components/Layout/DashboardItemHeader';
import { DashboardItemContent } from '@/components/Layout/DashboardItemContent';

import { AnalyticsHeader } from '../AnalyticsHeader';
import { SalesVolumeChart } from '../SalesVolumeChart';

// should be fine using same endpoints
// likely no optimization needed between showing one chart and rendering a couple more
// vs listings, showing 20 on dash, pagination, memo, etc on /listings page

export function DashboardAnalyticsView(): JSX.Element {
  return (
    <AnalyticsProvider>
      <DashboardItemHeader>
        <AnalyticsHeader />
      </DashboardItemHeader>

      <DashboardItemContent>
        <SalesVolumeChart />
      </DashboardItemContent>
    </AnalyticsProvider>
  );
}
