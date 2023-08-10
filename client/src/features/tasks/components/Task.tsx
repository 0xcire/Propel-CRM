import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';

import type { Task as TaskData } from '../types';
import { parseISO } from 'date-fns';
import { UpdateTask } from './UpdateTask';

type TaskProps = {
  task: TaskData;
};

const taskPriorityLookup = {
  low: '!',
  medium: '!!',
  high: '!!!',
};

export function Task({ task }: TaskProps): JSX.Element {
  let localFormat;
  if (task.dueDate) {
    localFormat = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
    }).format(parseISO(task.dueDate));
  }

  return (
    <div className='my-2 flex items-center justify-between py-1'>
      <Checkbox className='rounded-full outline-red-900' />
      <div className='flex w-full flex-col px-4'>
        <p className='line-clamp-1'>{task.title}</p>
        {/* {task.description && (
          <p className='line-clamp-1 text-[12px]'>{task.description}</p>
        )} */}
        {task.dueDate && <p className='text-[12px]'>Due: {localFormat}</p>}
      </div>
      <div className='flex items-center'>
        {task.priority && (
          <span className='mr-1 font-bold text-red-800'>
            {taskPriorityLookup[task.priority]}
          </span>
        )}
        <UpdateTask task={task} />
      </div>
    </div>
  );
}
