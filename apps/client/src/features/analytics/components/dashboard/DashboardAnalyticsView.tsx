import { AnalyticsProvider } from '../../context/AnalyticsContext';

import { DashboardItemHeader } from '@/components/Layout/dashboard/DashboardItemHeader';
import { DashboardItemContent } from '@/components/Layout/dashboard/DashboardItemContent';

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
