import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useTaskContext } from '../../context/TaskContext';

import { useTasks } from '../../hooks/useTasks';

import { TasksTable } from './TasksTable';
import { taskColumns } from '../../config/TaskColumns';
import { useQuerySearchParams } from '@/hooks';
import { useSearchTasks } from '../../hooks/useSearchTasks';

export function TaskPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setPageTitle] = useTaskContext()['title'];
  const { setQuery } = useQuerySearchParams('title');

  const { id } = useParams();

  const tasks = useTasks();
  const searchTasks = useSearchTasks();

  const isSearching = !!searchParams.get('title');

  useEffect(() => {
    if (id) return;
    if (
      !searchParams.get('page') ||
      !searchParams.get('completed') ||
      !searchParams.get('limit')
    ) {
      setSearchParams(
        [
          ['page', '1'],
          ['limit', '10'],
          ['completed', 'false'],
        ],
        {
          replace: true,
        }
      );
    }

    // eslint-disable-next-line
  }, []);

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
