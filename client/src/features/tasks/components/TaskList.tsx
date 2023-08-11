import { useTasks } from '../hooks/useTasks';

import { useTaskContext } from '../context/TaskContext';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Typography } from '@/components/ui/typography';

import { Spinner } from '@/components';

import { Task } from './Task';
import { CompletedTasks } from './CompletedTasks';

export function TaskList(): JSX.Element {
  const incompleteTasks = useTasks('false');

  const { state: showCompleted } = useTaskContext();

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
            key={task.id}
            task={task}
          />
        ))}

        {showCompleted && <CompletedTasks />}
      </>
    </ScrollArea>
  );
}
