import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';

import { useUpdateTask } from '../hooks/useUpdateTask';
import { useUser } from '@/lib/react-query-auth';

import { InfoIcon } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/form';
import { TextAreaInput } from '@/components/form';
import { DateInput } from '@/components/form';
import { SelectInput } from '@/components/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { SubmitButton } from '@/components';
import { DeleteTask } from './DeleteTask';

import { removeTimeZone } from '@/utils/date';
import { filterUndefined } from '@/utils/form-data';

import { priorityOptions } from '@/config';
import type { Priority } from '../types';
import type { Task as TaskData } from '../types';

// TODO: may consolidate add/update forms
const AddTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(255),
  notes: z.string().max(255),
  dueDate: z.union([z.date(), z.undefined()]),
  completed: z.boolean(),
  priority: z.union([z.enum(priorityOptions), z.undefined()]),
});
type AddTaskFields = z.infer<typeof AddTaskSchema>;

type TaskProps = {
  task: TaskData;
};

// TODO: either consolidate UpdateTask/AddTask into one TaskForm or,
// take page out of Todoist UX and change up

export function UpdateTask({ task }: TaskProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const updateTask = useUpdateTask();

  const user = useUser();

  const form = useForm<AddTaskFields>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description && task.description,
      notes: task.notes && task.notes,
      dueDate: task.dueDate
        ? new Date(removeTimeZone(task.dueDate))
        : undefined,
      completed: task.completed,
      priority: task.priority && task.priority,
    },
  });

  function onSubmit(values: AddTaskFields): void {
    const data = {
      userID: user.data?.id,
      title: values.title,
      completed: values.completed,
      description: values.description,
      notes: values.notes,
      dueDate: values.dueDate && format(values.dueDate, 'yyyy-MM-dd'),
      priority: values.priority,
    };

    filterUndefined(data);

    updateTask.mutate(
      { id: task.id, data: data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  }

  // TODO: clean up
  useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description ? task.description : '',
      notes: task.notes ? task.notes : '',
      dueDate: task.dueDate
        ? parseISO(removeTimeZone(task.dueDate))
        : undefined,
      priority: task.priority ? task.priority : undefined,
      completed: task.completed,
    });
  }, [task, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <InfoIcon
          className='cursor-pointer'
          size={16}
        />
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id='add-task'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <TextInput
              name='title'
              label='Title'
              control={form.control}
            />

            <TextInput
              name='description'
              label='Description'
              control={form.control}
            />

            <TextAreaInput
              name='notes'
              label='Notes'
              control={form.control}
            />

            <div className='flex items-center justify-between pt-4'>
              <DateInput
                name='dueDate'
                label='Due Date'
                control={form.control}
              />

              <SelectInput<AddTaskFields, Priority, typeof priorityOptions>
                name='priority'
                placeholder='Priority'
                options={priorityOptions}
                control={form.control}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DeleteTask id={task.id} />

          <DialogTrigger asChild>
            <Button variant='outline'>Close</Button>
          </DialogTrigger>
          <SubmitButton
            disabled={!form.formState.isDirty}
            form='add-task'
            isLoading={updateTask.isLoading}
            text='Save'
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
