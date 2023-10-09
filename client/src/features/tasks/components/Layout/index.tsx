import { Outlet } from 'react-router-dom';

import { TaskProvider } from '../../context/TaskContext';

import { PageContent, PageHeader, PageWrapper } from '@/components/Layout/page';

import { AddTask } from '../AddTask';

export function TaskLayout(): JSX.Element {
  return (
    <TaskProvider>
      <PageWrapper title='Tasks | Propel CRM'>
        <PageHeader text='Tasks'>
          <AddTask onDashboard={false} />
        </PageHeader>
        <PageContent>
          <Outlet />
        </PageContent>
      </PageWrapper>
    </TaskProvider>
  );
}
