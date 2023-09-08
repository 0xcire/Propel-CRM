import { useState } from 'react';

import type { DeepPartial } from 'react-hook-form';
import { format } from 'date-fns';

import { useUpdateTask } from '../hooks/useUpdateTask';
import { useUser } from '@/lib/react-query-auth';

import { InfoIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { removeTimeZone } from '@/utils/date';
import { filterUndefined } from '@/utils/form-data';

import type { Task as TaskData } from '../types';
import { CreateTaskFields, TaskForm } from './TaskForm';

type TaskProps = {
  task: TaskData;
};

export function UpdateTask({ task }: TaskProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const updateTask = useUpdateTask(setOpen);

  const user = useUser();

  const defaultValues: DeepPartial<CreateTaskFields> = {
    title: task.title,
    description: task.description,
    notes: task.notes,
    dueDate: task.dueDate ? new Date(removeTimeZone(task.dueDate)) : undefined,
    priority: task.priority,
  };

  function onSubmit(values: CreateTaskFields): void {
    const data = {
      userID: user.data?.id,
      title: values.title,
      description: values.description,
      notes: values.notes,
      dueDate: values.dueDate && format(values.dueDate, 'yyyy-MM-dd'),
      priority: values.priority,
    };

    filterUndefined(data);

    updateTask.mutate(
      { id: task.id, data: data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <InfoIcon
          className='cursor-pointer'
          size={16}
        />
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          task={task}
          isLoading={updateTask.isLoading}
          isCreate={false}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
