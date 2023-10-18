import { AnalyticsProvider } from '../../context/AnalyticsContext';

import { DashboardItemHeader } from '@/components/Layout/dashboard';
import { DashboardItemContent } from '@/components/Layout/dashboard';

import { AnalyticsHeader } from './AnalyticsHeader';
import { SalesVolumeChart } from '../SalesVolumeChart';

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
