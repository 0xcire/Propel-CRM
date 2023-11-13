import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useTaskContext } from '../../context/TaskContext';

import { useTasks } from '../../hooks/useTasks';
import { useSearchTasks } from '../../hooks/useSearchTasks';

import { useDebouncedQuerySearchParams, useDefaultSearchParams } from '@/hooks';

import { TasksTable } from './TasksTable';

import { taskColumns } from '../../config/TaskColumns';
import { defaultTaskPageParams } from '../../config';

export function TaskPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [, setPageTitle] = useTaskContext()['title'];
  const { setQuery } = useDebouncedQuerySearchParams('title');

  useDefaultSearchParams(defaultTaskPageParams);

  const tasks = useTasks();
  const searchTasks = useSearchTasks();

  const isSearching = !!searchParams.get('title');

  useEffect(() => {
    setPageTitle('Tasks');
  }, [setPageTitle]);

  return (
    <TasksTable
      data={isSearching ? searchTasks.data ?? [] : tasks.data ?? []}
      columns={taskColumns}
      isLoading={isSearching ? searchTasks.isLoading : tasks.isLoading}
      isFetching={isSearching ? searchTasks.isFetching : tasks.isFetching}
      setQuery={setQuery}
    />
  );
}
