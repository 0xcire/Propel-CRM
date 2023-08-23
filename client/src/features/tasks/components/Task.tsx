import { useCallback } from 'react';

import { parseISO } from 'date-fns';

import clsx from 'clsx';

import { useUpdateTask } from '../hooks/useUpdateTask';

import { Typography } from '@/components/ui/typography';

import { TaskForm } from './TaskForm';
import { UpdateTask } from './UpdateTask';

import { removeTimeZone } from '@/utils/date';

import type { Task as TaskData } from '../types';
import type { CheckedState } from '@radix-ui/react-checkbox';

type TaskProps = {
  task: TaskData;
};

const taskPriorityLookup = {
  low: '!',
  medium: '!!',
  high: '!!!',
};

export function Task({ task }: TaskProps): JSX.Element {
  const updateTask = useUpdateTask();

  const handleOnCheckedChange = useCallback((checked: CheckedState): void => {
    updateTask.mutate({
      id: task.id,
      data: {
        completed: checked as boolean,
      },
    });
  }, []);

  let localFormat;
  if (task.dueDate) {
    localFormat = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
    }).format(parseISO(removeTimeZone(task.dueDate)));
  }

  return (
    <div className='my-2 flex w-full py-1'>
      <TaskForm
        isCheckbox={true}
        isCreate={true}
        isLoading={updateTask.isLoading}
        handleOnCheckedChange={handleOnCheckedChange}
        defaultValues={{
          completed: task.completed,
        }}
      />
      <div
        className={clsx(
          'flex w-full flex-col px-4',
          task.completed && 'text-gray-400'
        )}
      >
        <p
          className={clsx(
            'line-clamp-1 pb-1 align-middle leading-none',
            task.completed && 'line-through'
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <Typography
            variant='p'
            className='line-clamp-1 text-[12px]'
          >
            {task.description}
          </Typography>
        )}
        {task.dueDate && <p className='text-[12px]'>Due: {localFormat}</p>}
      </div>
      <div className='flex items-start pt-[2px]'>
        {task.priority && (
          <span className='mr-1 font-bold leading-none text-red-800'>
            {taskPriorityLookup[task.priority]}
          </span>
        )}
        <UpdateTask task={task} />
      </div>
    </div>
  );
}
