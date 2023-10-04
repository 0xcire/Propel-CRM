import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useTasks } from '../../hooks/useTasks';

import { TaskTable } from './TasksTable';
import { taskColumns } from '../../config/TaskColumns';
import { useTaskContext } from '../../context/TaskContext';

export function TaskPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const { state: completed } = useTaskContext();
  // removes bug with modal route?
  const { id } = useParams();

  const tasks = useTasks(completed.toString());

  useEffect(() => {
    if (id) return;
    // console.log('yee shall see me twice');
  }, []);

  return (
    <TaskTable
      data={tasks.data ?? []}
      columns={taskColumns}
      isLoading={tasks.isLoading}
      isFetching={tasks.isFetching}
    />
  );
}
