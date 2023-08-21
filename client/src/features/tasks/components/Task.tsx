import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { parseISO } from 'date-fns';

import clsx from 'clsx';

import { useUpdateTask } from '../hooks/useUpdateTask';
import { removeTimeZone } from '@/utils/date';

import { Form } from '@/components/ui/form';
import {
  type CheckedChangeParams,
  FormCheckboxInput,
} from '@/components/FormCheckboxInput';

import { Typography } from '@/components/ui/typography';

import { UpdateTask } from './UpdateTask';

import type { Task as TaskData } from '../types';

type TaskProps = {
  task: TaskData;
};

const taskPriorityLookup = {
  low: '!',
  medium: '!!',
  high: '!!!',
};

const CompletedTaskSchema = z.object({
  completed: z.boolean(),
});

type CompletedTaskFields = z.infer<typeof CompletedTaskSchema>;

export function Task({ task }: TaskProps): JSX.Element {
  const updateTask = useUpdateTask();

  const form = useForm<CompletedTaskFields>({
    resolver: zodResolver(CompletedTaskSchema),
    defaultValues: {
      completed: task.completed,
    },
  });

  const handleOnCheckedChange = useCallback(
    ({ checked }: CheckedChangeParams): void => {
      // field.onChange(checked as boolean);
      updateTask.mutate({
        id: task.id,
        data: {
          completed: checked as boolean,
        },
      });
    },
    []
  );

  const onSubmit = (values: CompletedTaskFields): void => {
    console.log(values);
  };

  let localFormat;
  if (task.dueDate) {
    localFormat = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
    }).format(parseISO(removeTimeZone(task.dueDate)));
  }

  return (
    <div className='my-2 flex w-full py-1'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormCheckboxInput
            handleOnCheckedChange={handleOnCheckedChange}
            name='completed'
            control={form.control}
          />
        </form>
      </Form>
      <div
        className={clsx(
          'flex w-full flex-col px-4',
          task.completed && 'text-gray-400'
        )}
      >
        <p
          className={clsx(
            'line-clamp-1 align-middle',
            task.completed && 'line-through'
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <Typography
            variant='p'
            className=' line-clamp-1 text-[12px]'
          >
            {task.description}
          </Typography>
        )}
        {task.dueDate && <p className='text-[12px]'>Due: {localFormat}</p>}
      </div>
      <div className='flex items-start pt-1'>
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
