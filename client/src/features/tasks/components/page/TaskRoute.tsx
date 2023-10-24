import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTask } from '../../hooks/useTask';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Spinner } from '@/components';

import { NestedNotFound } from '@/components/Layout/page/NestedNotFound';

import { CreateTaskFields, TaskForm } from '../TaskForm';

import { filterUndefined } from '@/utils/form-data';
import { useUser } from '@/lib/react-query-auth';
import { format } from 'date-fns';
import { useUpdateTask } from '../../hooks/useUpdateTask';
import { removeTimeZone } from '@/utils';

export function TaskRoute(): JSX.Element {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const { id } = useParams();
  const user = useUser();
  const task = useTask(+(id as string));
  const updateTask = useUpdateTask({ isCheckbox: false });

  if (task.isLoading) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open: boolean): void => {
          if (!open) {
            navigate(-1);
            setOpen(false);
          }
        }}
      >
        <DialogContent className='h-[80vh]'>
          <div className='grid h-full w-full place-items-center'>
            <Spinner
              className='mx-auto'
              variant='md'
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task.data || !task.data[0]) {
    return <NestedNotFound context='task' />;
  }

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
      { id: (task.data && task.data[0]?.id) as number, data: data },
      {
        onSuccess: () => {
          // setOpen(false);
          navigate(-1);
        },
      }
    );
  }

  // TODO: address bad enum value
  // const defaultValues = generateDefaultValues(task.data[0]);

  const defaultValues = {
    title: task.data[0].title,
    description: task.data[0].description,
    notes: task.data[0].notes,
    dueDate: task.data[0].dueDate
      ? new Date(removeTimeZone(task.data[0].dueDate))
      : undefined,
    priority: task.data[0].priority || undefined,
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean): void => {
        if (!open) {
          navigate(-1);
          setOpen(false);
        }
      }}
    >
      <DialogContent>
        <div>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </DialogHeader>

          <TaskForm
            isCreate={false}
            task={task.data[0]}
            isLoading={updateTask.isLoading}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
