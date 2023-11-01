import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { taskColumns } from '../../config/TaskColumns';

import { useTaskContext } from '../../context/TaskContext';

import { useContact } from '@/features/contacts/hooks/useContact';
import { useContactTasks } from '../../hooks/useContactTasks';

import { TasksTable } from './TasksTable';

export function ContactTaskPage(): JSX.Element {
  const [, setPageTitle] = useTaskContext()['title'];
  const { id } = useParams();

  const contactTasks = useContactTasks(+(id as string));
  const contact = useContact(+(id as string));

  useEffect(() => {
    if (contact.isLoading) {
      setPageTitle(`Tasks for ...`);
    }
    if (contact.data) {
      setPageTitle(`Tasks for ${contact.data[0]?.name}`);
    }
  }, [id, setPageTitle, contact.data, contact.isLoading]);

  return (
    <TasksTable
      data={contactTasks.data ?? []}
      columns={taskColumns}
      isLoading={contactTasks.isLoading}
      isFetching={contactTasks.isFetching}
    />
  );
}
