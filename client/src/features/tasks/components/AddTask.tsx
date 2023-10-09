import { useState } from 'react';

import { useUser } from '@/lib/react-query-auth';
import { useCreateTask } from '../hooks/useCreateTask';

import { formatISO } from 'date-fns';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { TaskForm } from './TaskForm';

import { handleOnOpenChange } from '@/utils';
import { filterUndefined } from '@/utils/form-data';

import type { DeepPartial } from 'react-hook-form';
import type { CreateTaskFields } from './TaskForm';

export function AddTask({
  onDashboard,
}: {
  onDashboard: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
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
      },
    });
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open): void => handleOnOpenChange(open, setOpen)}
      >
        <DialogTrigger
          onClick={(e): void => e.stopPropagation()}
          asChild
        >
          {onDashboard ? (
            <div className='flex w-full cursor-pointer items-center'>
              <PlusIcon size={18} />
              Add Task
            </div>
          ) : (
            <Button>
              <span className='flex items-center'>
                <PlusIcon
                  className='pt-[2px]'
                  size={18}
                />
                Add Task
              </span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent
          onClick={(e): void => e.stopPropagation()}
          className='sm:max-w-[425px]'
        >
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
      </Dialog>
    </>
  );
}
