import { useUser } from '@/lib/react-query-auth';

import { useDashboardTasks } from '../../hooks/useDashboardTasks';

import { useTaskContext } from '../../context/TaskContext';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Typography } from '@/components/ui/typography';

import { Spinner } from '@/components';

import { Task } from '../Task';
import { CompletedTasks } from '../CompletedTasks';

export function DashboardTasks(): JSX.Element {
  const user = useUser();
  const incompleteTasks = useDashboardTasks('false');

  const { showCompleted } = useTaskContext();

  // extract this
  if (incompleteTasks.isLoading) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
    );
  }

  // extract this
  if (incompleteTasks.data && !incompleteTasks.data[0]) {
    return (
      <Typography
        className='px-4 text-slate-500'
        variant='p'
      >
        No tasks to display.
      </Typography>
    );
  }

  return (
    <ScrollArea className='h-full p-4 pt-0'>
      <>
        {incompleteTasks.data?.map((task) => (
          <Task
            userID={user.data?.id as number}
            key={task.id}
            task={task}
          />
        ))}

        {showCompleted && <CompletedTasks userID={user.data?.id as number} />}
      </>
    </ScrollArea>
  );
}
