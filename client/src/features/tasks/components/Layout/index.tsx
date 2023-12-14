import { Outlet } from 'react-router-dom';

import { useTaskContext } from '../../context/TaskContext';

import { PageHeader } from '@/components/Layout/page/PageHeader';
import { PageContent } from '@/components/Layout/page/PageContent';
import { PageWrapper } from '@/components/Layout/page/PageWrapper';

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
