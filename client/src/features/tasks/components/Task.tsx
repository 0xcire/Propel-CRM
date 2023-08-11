import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import clsx from 'clsx';

import { parseISO } from 'date-fns';

import { useUpdateTask } from '../hooks/useUpdateTask';
import { removeTimeZone } from '@/utils/date';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';

import { UpdateTask } from './UpdateTask';

import type { Task as TaskData } from '../types';

import { type CheckedState } from '@radix-ui/react-checkbox';

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
          <FormField
            control={form.control}
            name='completed'
            render={({ field }): JSX.Element => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked: CheckedState): void => {
                      field.onChange(checked as boolean);
                      updateTask.mutate({
                        id: task.id,
                        data: {
                          completed: checked as boolean,
                        },
                      });
                    }}
                    className='mt-[5px] rounded-full outline-red-900'
                  />
                </FormControl>
              </FormItem>
            )}
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
