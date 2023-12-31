import { useUpdateTask } from '../hooks/useUpdateTask';

import { TaskForm } from './TaskForm';

import type { CheckedState } from '@radix-ui/react-checkbox';

type TaskCheckboxProps = {
  taskID: number;
  completed: boolean;
};

export function TaskCheckbox({
  taskID,
  completed,
}: TaskCheckboxProps): JSX.Element {
  const updateTask = useUpdateTask({ isCheckbox: true });

  const handleOnCheckedChange = (checked: CheckedState): void => {
    updateTask.mutate({
      id: taskID,
      data: {
        completed: checked as boolean,
      },
    });
  };

  return (
    <TaskForm
      isCheckbox
      isCreate
      isLoading={updateTask.isLoading}
      handleOnCheckedChange={handleOnCheckedChange}
      defaultValues={{
        completed: completed,
      }}
    />
  );
}
