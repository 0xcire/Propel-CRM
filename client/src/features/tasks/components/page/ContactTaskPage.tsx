import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useTaskContext } from '../../context/TaskContext';

import { useContact } from '@/features/contacts/hooks/useContact';
import { useContactTasks } from '../../hooks/useContactTasks';
import { useSearchTasks } from '../../hooks/useSearchTasks';

import { useDebouncedQuerySearchParams, useDefaultSearchParams } from '@/hooks';

import { TasksTable } from './TasksTable';

import { taskColumns } from '../../config/TaskColumns';
import { defaultTaskPageParams } from '../../config';

// TODO: need to add endpoints to allow user to search tasks from specific contact/listing

export function ContactTaskPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [, setPageTitle] = useTaskContext()['title'];
  const { id } = useParams();
  const { setQuery } = useDebouncedQuerySearchParams('title');

  useDefaultSearchParams(defaultTaskPageParams);

  const contactTasks = useContactTasks(+(id as string));
  const searchTasks = useSearchTasks();
  const contact = useContact(+(id as string));

  const isSearching = !!searchParams.get('title');

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
      data={isSearching ? searchTasks.data ?? [] : contactTasks.data ?? []}
      columns={taskColumns}
      isLoading={isSearching ? searchTasks.isLoading : contactTasks.isLoading}
      isFetching={
        isSearching ? searchTasks.isFetching : contactTasks.isFetching
      }
      setQuery={setQuery}
    />
  );
}
