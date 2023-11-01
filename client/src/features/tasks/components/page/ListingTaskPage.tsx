import { useParams } from 'react-router-dom';

import { useTaskContext } from '../../context/TaskContext';

import { TasksTable } from './TasksTable';
import { taskColumns } from '../../config/TaskColumns';
import { useListingTasks } from '../../hooks/useListingTasks';
import { useEffect } from 'react';

export function ListingTaskPage(): JSX.Element {
  const [, setPageTitle] = useTaskContext()['title'];
  const { id } = useParams();

  const listingTasks = useListingTasks(+(id as string));

  useEffect(() => {
    setPageTitle(`Tasks for Listing ${id}`);
  }, [id, setPageTitle]);

  return (
    <TasksTable
      data={listingTasks.data ?? []}
      columns={taskColumns}
      isLoading={listingTasks.isLoading}
      isFetching={listingTasks.isFetching}
    />
  );
}
