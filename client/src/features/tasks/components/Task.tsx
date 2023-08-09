import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import type { Task as TaskData } from '../types';
import { parseISO } from 'date-fns';
import { UpdateTask } from './UpdateTask';

type TaskProps = {
  task: TaskData;
};

export function Task({ task }: TaskProps): JSX.Element {
  //   console.log(task);
  let localFormat;
  if (task.dueDate) {
    localFormat = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
    }).format(parseISO(task.dueDate));
  }

  return (
    <div className='my-2 flex items-center justify-between py-1'>
      <Checkbox className='rounded-full' />
      <div className='flex w-full flex-col px-4'>
        {task.priority && (
          <Badge className='w-fit text-[10px]'>{task.priority}</Badge>
        )}
        <p>{task.title}</p>
        {task.dueDate && <p className='text-[12px]'>Due: {localFormat}</p>}
      </div>
      <UpdateTask task={task} />
    </div>
  );
}
