import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useTaskContext } from '../../context/TaskContext';

import { useTasks } from '../../hooks/useTasks';

import { TasksTable } from './TasksTable';
import { taskColumns } from '../../config/TaskColumns';

export function TaskPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setPageTitle] = useTaskContext()['title'];

  const { id } = useParams();

  const tasks = useTasks();

  useEffect(() => {
    if (id) return;
    if (!searchParams.get('page') || !searchParams.get('completed')) {
      setSearchParams(
        [
          ['page', '1'],
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
      data={tasks.data ?? []}
      columns={taskColumns}
      isLoading={tasks.isLoading}
      isFetching={tasks.isFetching}
    />
  );
}
