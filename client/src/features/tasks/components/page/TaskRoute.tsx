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

import { TaskForm } from '../TaskForm';

import { generateDefaultValues } from '@/utils/form-data';

export function TaskRoute(): JSX.Element {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const { id } = useParams();
  const task = useTask(+(id as string));

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
  console.log(task.data[0]);

  const defaultValues = generateDefaultValues(task.data[0]);
  console.log(defaultValues);

  // return <div>hey</div>;

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
            isLoading={task.isLoading}
            defaultValues={defaultValues}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
