import { useDashboardTasks } from '../hooks/useDashboardTasks';

import { Spinner } from '@/components';
import { Task } from './Task';

export function CompletedTasks({ userID }: { userID: number }): JSX.Element {
  const completedTasks = useDashboardTasks('true');

  if (completedTasks.isLoading) {
    return <Spinner variant='md' />;
  }

  return (
    <>
      {completedTasks.data?.map((task) => (
        <Task
          userID={userID}
          key={task.id}
          task={task}
        />
      ))}
    </>
  );
}
