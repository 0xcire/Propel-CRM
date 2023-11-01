import { Outlet } from 'react-router-dom';

import { useTaskContext } from '../../context/TaskContext';

import { PageContent, PageHeader, PageWrapper } from '@/components/Layout/page';

import { AddTask } from '@/features/common/tasks/components/AddTask';

export function TaskLayout(): JSX.Element {
  const [pageTitle] = useTaskContext()['title'];

  const documentTitle = `${pageTitle} | Propel CRM`;

  return (
    <PageWrapper title={documentTitle}>
      <PageHeader text={pageTitle}>
        <AddTask />
      </PageHeader>
      <PageContent>
        <Outlet />
      </PageContent>
    </PageWrapper>
  );
}
