// TODO: obviously this should be refactored into <Dashboard /> once everything is built out
// TODO: and also obviously need to refactor out <TaskDashboardView />, <ContactsDashboardView /> etc etc
// TODO: fix mobile navbar trigger position

import { useNavigate } from 'react-router-dom';

import { useLogout, useUser } from '@/lib/react-query-auth';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { Typography } from '@/components/ui/typography';

import { SubmitButton } from '@/components/SubmitButton';

import { DashboardItemHeader } from '@/components/Layout/DashboardItemHeader';
import { DashboardGridItem } from '@/components/Layout/DashboardGridItem';
import { DashboardItemContent } from '@/components/Layout/DashboardItemContent';

import { AddContact } from '@/features/contacts/components/AddContact';
import { ContactList } from '@/features/contacts/components/ContactList';
import { TaskList } from '@/features/tasks/components/TaskList';

import { TaskDropdown } from '@/features/tasks/components/TaskDropdown';
import { TaskProvider } from '@/features/tasks/context/TaskContext';

import { AnalyticsProvider } from '@/features/analytics/context/AnalyticsContext';
import { SalesVolumeChart } from '@/features/analytics/components/SalesVolumeChart';
import { AnalyticsHeader } from '@/features/analytics/components/AnalyticsHeader';
import { DashboardListingView } from '@/features/listings/components/dashboard/DashboardListingView';

export const Dashboard = (): JSX.Element => {
  const user = useUser();
  const logout = useLogout();
  const navigate = useNavigate();

  useDocumentTitle('Dashboard | Propel CRM');

  if (!user) {
    navigate('/auth/signin');
  }

  return (
    <>
      <div className='flex h-full w-full flex-1 flex-col py-10'>
        <div className='flex w-full items-center justify-between px-10'>
          <Typography variant='h3'>
            Welcome, {user.data?.name as string}
          </Typography>
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
            {/* <DashboardContactsView /> */}
            <DashboardItemHeader>
              <Typography variant='h4'>Contacts</Typography>
              <AddContact />
            </DashboardItemHeader>

            <DashboardItemContent>
              <ContactList />
            </DashboardItemContent>
          </DashboardGridItem>

          <DashboardGridItem className='col-start-1 col-end-4 row-start-4 row-end-7'>
            <TaskProvider>
              {/* <DashboardTasksView /> */}
              <DashboardItemHeader>
                <Typography variant='h4'>Tasks</Typography>
                <TaskDropdown />
              </DashboardItemHeader>

              <DashboardItemContent>
                <TaskList />
              </DashboardItemContent>
            </TaskProvider>
          </DashboardGridItem>

          <DashboardGridItem className='col-start-4 col-end-10 row-start-4 row-end-7 2xl:col-end-11'>
            {/* <DashboardAnalyticsView /> */}
            <AnalyticsProvider>
              <DashboardItemHeader>
                <AnalyticsHeader />
              </DashboardItemHeader>

              <DashboardItemContent>
                <SalesVolumeChart />
              </DashboardItemContent>
            </AnalyticsProvider>
          </DashboardGridItem>
        </div>
      </div>
    </>
  );
};
