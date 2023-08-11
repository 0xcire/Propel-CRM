import { Spinner } from '@/components';
import { useTasks } from '../hooks/useTasks';
import { Task } from './Task';

export function CompletedTask(): JSX.Element {
  const completedTasks = useTasks('true');

  if (completedTasks.isLoading) {
    return <Spinner variant='md' />;
  }

  return (
    <>
      {completedTasks.data?.map((task) => {
        <Task task={task} />;
      })}
    </>
  );
}
