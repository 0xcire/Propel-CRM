import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useTaskContext } from '../../context/TaskContext';

import { useListingTasks } from '../../hooks/useListingTasks';
import { useSearchTasks } from '../../hooks/useSearchTasks';
import { useDebouncedQuerySearchParams } from '@/hooks/useDebouncedQuerySearchParams';
import { useDefaultSearchParams } from '@/hooks/useDefaultSearchParams';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';

import { TasksTable } from './TasksTable';

import { taskColumns } from '../../config/TaskColumns';
import { defaultTaskPageParams } from '../../config';

export function ListingTaskPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [, setPageTitle] = useTaskContext()['title'];
  const { listingID } = useParams();
  const { setQuery } = useDebouncedQuerySearchParams('title');

  useIdleTimeout();

  useDefaultSearchParams(defaultTaskPageParams);

  const listingTasks = useListingTasks(+(listingID as string));
  const searchTasks = useSearchTasks();

  const isSearching = !!searchParams.get('title');

  useEffect(() => {
    setPageTitle(`Tasks for Listing ${listingID}`);
  }, [listingID, setPageTitle]);

  return (
    <TasksTable
      data={isSearching ? searchTasks.data ?? [] : listingTasks.data ?? []}
      columns={taskColumns}
      isLoading={isSearching ? searchTasks.isLoading : listingTasks.isLoading}
      isFetching={
        isSearching ? searchTasks.isFetching : listingTasks.isFetching
      }
      setQuery={setQuery}
    />
  );
}
