import { useState } from 'react';

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

import { TaskForm } from './TaskForm';

import { removeTimeZone } from '@/utils/date';
import { filterUndefined } from '@/utils/form-data';

import type { DeepPartial } from 'react-hook-form';
import type { Task as TaskData } from '../types';
import type { CreateTaskFields } from './TaskForm';

// TODO: as dashboard and per page components have been built out,
// can extract common typing
type TaskProps = {
  task: TaskData;
  text?: string;
};

export function UpdateTask({ task, text }: TaskProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const updateTask = useUpdateTask();

  const user = useUser();

  const defaultValues: DeepPartial<CreateTaskFields> = {
    title: task.title,
    description: task.description ?? '',
    notes: task.notes ?? '',
    dueDate: task.dueDate ? new Date(removeTimeZone(task.dueDate)) : undefined,
    priority: task.priority ?? undefined,
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
      // onOpenChange={setOpen}
      onOpenChange={(open): void => {
        if (open) {
          setOpen(true);
        } else {
          setOpen(false);
          document.body.style.pointerEvents = ''; // best solution?
        }
      }}
    >
      <DialogTrigger
        className='cursor-pointer'
        asChild
      >
        {text ? (
          <p
            onClick={(e): void => e.stopPropagation()}
            className='w-full'
          >
            {text}
          </p>
        ) : (
          <InfoIcon size={16} />
        )}
      </DialogTrigger>
      <DialogContent
        onClick={(e): void => e.stopPropagation()}
        // h-[80vh]
        className='sm:max-w-[425px]'
      >
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
