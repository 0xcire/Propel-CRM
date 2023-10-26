import { Outlet } from 'react-router-dom';

import { useTaskContext } from '../../context/TaskContext';

import { PageContent, PageHeader, PageWrapper } from '@/components/Layout/page';

import { AddTask } from '../AddTask';

export function TaskLayout(): JSX.Element {
  const { pageTitle } = useTaskContext();

  const documentTitle = `${pageTitle} | Propel CRM`;

  return (
    <PageWrapper title={documentTitle}>
      <PageHeader text={pageTitle}>
        <AddTask onDashboard={false} />
      </PageHeader>
      <PageContent>
        <Outlet />
      </PageContent>
    </PageWrapper>
  );
}
