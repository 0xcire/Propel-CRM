// TODO: obviously this should be refactored into <Dashboard /> once everything is built out
// TODO: and also obviously need to refactor out <TaskDashboardView />, <ContactsDashboardView /> etc etc
// TODO: fix mobile navbar trigger position

import { useNavigate } from 'react-router-dom';

import { useLogout, useUser } from '@/lib/react-query-auth';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { Typography } from '@/components/ui/typography';

import { SubmitButton } from '@/components/SubmitButton';

import { DashboardGridItem } from '@/components/Layout/DashboardGridItem';

import { DashboardListingView } from '@/features/listings/components/dashboard';
import { DashboardContactsView } from '@/features/contacts/components/dashboard';
import { DashboardTasksView } from '@/features/tasks/components/dashboard';
import { DashboardAnalyticsView } from '@/features/analytics/components/dashboard';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { Navbar } from '@/components/Navbar';

export const Dashboard = (): JSX.Element => {
  const user = useUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  useDocumentTitle('Dashboard | Propel CRM');

  if (!user) {
    navigate('/auth/signin');
  }

  return (
    <>
      <div className='flex h-full w-full flex-1 flex-col py-10'>
        <div className='flex w-full items-center justify-between px-10'>
          <div className='flex items-center gap-2'>
            {!isDesktop && <Navbar />}
            <Typography variant='h3'>
              Welcome, {user.data?.name as string}
            </Typography>
          </div>
          <SubmitButton
            text='Logout'
            isLoading={logout.isLoading}
            onClick={(): void => logout.mutate()}
          />
        </div>

        <div className='grid h-full max-h-screen flex-1 grid-cols-12 grid-rows-6 gap-4 p-10 pb-0  xl:flex-1'>
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
