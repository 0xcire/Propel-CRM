import { useUser } from '@/lib/react-query-auth';

import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { Typography } from '@/components/ui/typography';

import { Navbar } from '@/components/Navbar';
import { DashboardGridItem } from '@/components/Layout/dashboard/DashboardGridItem';
import { DashboardListingView } from '@/features/listings/components/dashboard';
import { DashboardContactsView } from '@/features/contacts/components/dashboard/DashboardContactsView';
import { DashboardTasksView } from '@/features/tasks/components/dashboard/DashboardTasksView';
import { DashboardAnalyticsView } from '@/features/analytics/components/dashboard/DashboardAnalyticsView';

import { dateIntl } from '@/utils/intl';
import { useVerifyAccountReminder } from '@/hooks/useVerifyAccountReminder';

export const Dashboard = (): JSX.Element => {
  const user = useUser();
  const isDesktop = useIsDesktop();

  useDocumentTitle('Dashboard | Propel CRM');
  useVerifyAccountReminder();
  useIdleTimeout();

  const date = new Date();

  return (
    <>
      <div
        data-testid='dashboard'
        className='flex h-full w-full flex-1 flex-col px-6 py-4 pb-0 md:h-screen'
      >
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-2'>
            {!isDesktop && <Navbar />}
            <div>
              <Typography
                variant='h3'
                className='text-[22px] font-black antialiased'
              >
                Welcome, {user.data?.name as string}
              </Typography>
              <p className='text-sm'>
                Today is {dateIntl('long').format(date)}
              </p>
            </div>
          </div>
        </div>

        <div className='flex h-full flex-col gap-4 py-4 md:grid md:grid-cols-2 md:grid-rows-12 lg:grid-cols-12 lg:grid-rows-6 xl:flex-1'>
          <DashboardGridItem className='h-[400px] md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-5 md:h-auto lg:col-start-1 lg:col-end-10 lg:row-start-1 lg:row-end-4 2xl:col-end-11'>
            <DashboardListingView />
          </DashboardGridItem>

          <DashboardGridItem className='h-[350px] md:row-start-5 md:row-end-9 md:h-auto lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-7 2xl:col-start-11'>
            <DashboardContactsView />
          </DashboardGridItem>

          <DashboardGridItem className='h-[350px] md:col-start-2 md:col-end-3 md:row-start-5 md:row-end-9 md:h-auto lg:col-start-1 lg:col-end-4 lg:row-start-4 lg:row-end-7'>
            <DashboardTasksView />
          </DashboardGridItem>

          <DashboardGridItem className='h-[400px] md:col-start-1 md:col-end-3 md:row-start-9 md:row-end-13 md:h-auto lg:col-start-4 lg:col-end-10 lg:row-start-4 lg:row-end-7 2xl:col-end-11'>
            <DashboardAnalyticsView />
          </DashboardGridItem>
        </div>
      </div>
    </>
  );
};
