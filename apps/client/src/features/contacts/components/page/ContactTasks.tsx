import { Link } from 'react-router-dom';

import { useUser } from '@/lib/react-query-auth';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Spinner } from '@/components/Spinner';
import { Task } from '@/features/tasks/components/Task'; // one off

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '@/features/tasks/types';

type ContactTasksProps = {
  tasks: UseQueryResult<Tasks, unknown>;
  contactID: number;
};

export function ContactTasks({
  tasks,
  contactID,
}: ContactTasksProps): JSX.Element {
  const user = useUser();

  if (tasks.isLoading) {
    return <Spinner fillContainer />;
  }

  return (
    <>
      <div className='flex h-[50px] items-center px-4'>
        <Link
          className='text-lg font-bold'
          to={`/tasks/contacts/${contactID}?page=1&limit=10&completed=false`}
        >
          Upcoming Tasks
        </Link>
      </div>
      <div className='absolute h-[calc(100%-50px)] w-full'>
        <ScrollArea className='h-full w-full'>
          {tasks.data?.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              You're all caught up!
            </p>
          ) : (
            tasks.data?.map((task) => (
              <Task
                key={`task-${task.id}`}
                task={task}
                userID={user.data?.id as number}
                className='px-4'
              />
            ))
          )}
        </ScrollArea>
      </div>
    </>
  );
}
