import { useTasks } from '../hooks/useTasks';

import { Spinner } from '@/components';
import { Task } from './Task';

export function CompletedTasks(): JSX.Element {
  const completedTasks = useTasks('true');

  if (completedTasks.isLoading) {
    return <Spinner variant='md' />;
  }

  return (
    <>
      {completedTasks.data?.map((task) => (
        <Task
          key={task.id}
          task={task}
        />
      ))}
    </>
  );
}
