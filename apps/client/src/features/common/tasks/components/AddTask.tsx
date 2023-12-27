import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useUser } from '@/lib/react-query-auth';
import { useCreateTask } from '@/features/tasks/hooks/useCreateTask';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { TaskForm } from '@/features/tasks/components/TaskForm';

import { formatISO } from 'date-fns';

import { filterUndefined } from '@/utils/form-data';
import { handleOnOpenChange } from '@/utils';

import type { PropsWithChildren } from 'react';
import type { CreateTaskFields } from '@/features/tasks/components/TaskForm';
import type { DeepPartial } from 'react-hook-form';

interface AddTaskProps extends PropsWithChildren {
  asDropdownMenuItem?: boolean;
  contactID?: number;
  listingID?: number;
}

export function AddTask({
  children,
  asDropdownMenuItem,
  contactID,
  listingID,
}: AddTaskProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const { listingID: listingIDParam, contactID: contactIDParam } = useParams();

  const user = useUser();

  const createTask = useCreateTask();

  const defaultValues: DeepPartial<CreateTaskFields> = {
    title: '',
    description: '',
    notes: '',
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
      ...(!!(contactID || contactIDParam) && {
        contactID: contactIDParam ? +contactIDParam : contactID,
      }),
      ...(!!(listingID || listingIDParam) && {
        listingID: listingIDParam ? +listingIDParam : listingID,
      }),
    };

    filterUndefined(data);

    createTask.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open): void => handleOnOpenChange(open, setOpen)}
    >
      <DialogTrigger asChild>
        {asDropdownMenuItem ? (
          <DropdownMenuItem
            onSelect={(e): void => e.preventDefault()}
            className='cursor-pointer'
          >
            {listingID || contactID ? <></> : <PlusIcon size={18} />}
            Add Task
          </DropdownMenuItem>
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
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          {children && <DialogDescription>{children}</DialogDescription>}
        </DialogHeader>
        <TaskForm
          isCreate={true}
          isLoading={createTask.isLoading}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
