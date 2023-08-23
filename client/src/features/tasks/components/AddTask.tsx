import { type Dispatch, type SetStateAction } from 'react';

import { DeepPartial } from 'react-hook-form';
import { formatISO } from 'date-fns';

import { useCreateTask } from '../hooks/useCreateTask';
import { useUser } from '@/lib/react-query-auth';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { filterUndefined } from '@/utils/form-data';
import { CreateTaskFields, TaskForm } from './TaskForm';

export function AddTask({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const createTask = useCreateTask();

  const user = useUser();

  const defaultValues: DeepPartial<CreateTaskFields> = {
    title: '',
    description: undefined,
    notes: undefined,
    dueDate: undefined,
    priority: undefined,
  };

  function onSubmit(values: CreateTaskFields): void {
    const data = {
      userID: user.data?.id,
      title: values.title,
      description: values.description,
      notes: values.notes,
      dueDate: values.dueDate && formatISO(values.dueDate),
      priority: values.priority,
    };

    filterUndefined(data);

    createTask.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        // form.reset();
      },
    });
  }

  return (
    <>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          isCreate={true}
          isLoading={createTask.isLoading}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </>
  );
}
