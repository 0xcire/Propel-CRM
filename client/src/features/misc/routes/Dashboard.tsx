import { useUser } from '@/lib/react-query-auth';

import { useIsDesktop, useDocumentTitle } from '@/hooks';

import { Typography } from '@/components/ui/typography';

import { Navbar } from '@/components/Navbar';
import { DashboardGridItem } from '@/components/Layout/dashboard';
import { DashboardListingView } from '@/features/listings/components/dashboard';
import { DashboardContactsView } from '@/features/contacts/components/dashboard';
import { DashboardTasksView } from '@/features/tasks/components/dashboard';
import { DashboardAnalyticsView } from '@/features/analytics/components/dashboard';

import { dateIntl } from '@/utils/intl';

export const Dashboard = (): JSX.Element => {
  const user = useUser();
  const isDesktop = useIsDesktop();
  useDocumentTitle('Dashboard | Propel CRM');

  const date = new Date();

  return (
    <>
      <div className='flex h-full w-full flex-1 flex-col px-6 py-4 pb-0'>
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

        <div className='grid h-full max-h-screen flex-1 grid-cols-12 grid-rows-6 gap-4 py-4 xl:flex-1'>
          <DashboardGridItem className='col-start-1 col-end-10 row-start-1 row-end-4 2xl:col-end-11'>
            <DashboardListingView />
          </DashboardGridItem>

          <DashboardGridItem className='col-start-10 col-end-13 row-start-1 row-end-7 2xl:col-start-11'>
            <DashboardContactsView />
          </DashboardGridItem>

          <DashboardGridItem className='col-start-1 col-end-4 row-start-4 row-end-7'>
            <DashboardTasksView />
          </DashboardGridItem>

          <DashboardGridItem className='col-start-4 col-end-10 row-start-4 row-end-7 2xl:col-end-11'>
            <DashboardAnalyticsView />
          </DashboardGridItem>
        </div>
      </div>
    </>
  );
};
