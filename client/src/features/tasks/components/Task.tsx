import clsx from 'clsx';

import { Typography } from '@/components/ui/typography';

import { TaskCheckbox } from './TaskCheckbox';
import { UpdateTask } from './UpdateTask';

import { formatDateString } from '@/utils/intl';

import type { Task as TaskData } from '../types';

type TaskProps = {
  userID: number;
  task: TaskData;
};

const taskPriorityLookup = {
  low: '!',
  medium: '!!',
  high: '!!!',
};

export function Task({ task, userID }: TaskProps): JSX.Element {
  let localFormat;
  if (task.dueDate) {
    localFormat = formatDateString(task.dueDate);
  }

  return (
    <div className='my-2 flex w-full py-1'>
      <TaskCheckbox
        taskID={task.id}
        completed={task.completed as boolean}
      />
      <div
        className={clsx(
          'flex w-full flex-col px-4',
          task.completed && 'text-gray-400'
        )}
      >
        <p
          className={clsx(
            'line-clamp-1 align-middle leading-tight',
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
      <div className='flex items-start pt-[3px]'>
        {task.priority && (
          <span className='mr-1 font-bold leading-none text-red-800'>
            {taskPriorityLookup[task.priority]}
          </span>
        )}
        <UpdateTask
          userID={userID}
          task={task}
        />
      </div>
    </div>
  );
}
