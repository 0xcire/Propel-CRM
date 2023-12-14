import { useUser } from '@/lib/react-query-auth';

import { useDashboardTasks } from '../../hooks/useDashboardTasks';

import { useTaskContext } from '../../context/TaskContext';

import { ScrollArea } from '@/components/ui/scroll-area';

import { ListEmpty } from '@/components/ListEmpty';
import { Spinner } from '@/components/Spinner';

import { Task } from '../Task';
import { CompletedTasks } from '../CompletedTasks';

export function DashboardTasks(): JSX.Element {
  const user = useUser();
  const incompleteTasks = useDashboardTasks('false');

  const [showCompleted] = useTaskContext()['completed'];

  if (incompleteTasks.isLoading) {
    return (
      <Spinner
        variant='md'
        fillContainer
      />
    );
  }

  if (incompleteTasks.data && !incompleteTasks.data[0]) {
    return <ListEmpty>No tasks to display.</ListEmpty>;
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
