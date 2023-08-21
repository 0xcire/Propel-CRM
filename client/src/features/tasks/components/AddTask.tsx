import { type Dispatch, type SetStateAction } from 'react';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatISO } from 'date-fns';

import { useCreateTask } from '../hooks/useCreateTask';
import { useUser } from '@/lib/react-query-auth';

import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/form';
import { TextAreaInput } from '@/components/form';
import { SelectInput } from '@/components/form';
import { DateInput } from '@/components/form';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components';

import { priorityOptions } from '@/config';
import type { Priority } from '../types';
import { fieldsAreDirty, filterUndefined } from '@/utils/form-data';

const AddTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.union([z.string().max(255), z.undefined()]),
  notes: z.union([z.string().max(255), z.undefined()]),
  dueDate: z.union([z.date(), z.undefined()]),
  completed: z.boolean(),
  priority: z.union([z.enum(priorityOptions), z.undefined()]),
});
type AddTaskFields = z.infer<typeof AddTaskSchema>;

export function AddTask({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const createTask = useCreateTask();

  const user = useUser();

  const form = useForm<AddTaskFields>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      title: '',
      description: undefined,
      notes: undefined,
      dueDate: undefined,
      completed: false,
      priority: undefined,
    },
  });

  const titleIsEmpty = fieldsAreDirty<AddTaskFields>(form, 'title');

  function onSubmit(values: AddTaskFields): void {
    // TODO : clean up

    const data = {
      userID: user.data?.id,
      title: values.title,
      description: values.description,
      notes: values.notes,
      dueDate: values.dueDate && formatISO(values.dueDate),
      priority: values.priority,
    };

    filterUndefined(data);

    createTask.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id='add-task'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <TextInput
              name='title'
              label='Title'
              placeholder='wash the dog'
              control={form.control}
            />

            <TextInput
              name='description'
              label='Description'
              placeholder='and the cat'
              control={form.control}
            />

            <TextAreaInput
              name='notes'
              label='Notes'
              placeholder='theyre both allergic to soap'
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
                options={priorityOptions}
                control={form.control}
                placeholder='Priority'
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant='outline'>Close</Button>
          </DialogTrigger>
          <SubmitButton
            disabled={!titleIsEmpty}
            form='add-task'
            isLoading={createTask.isLoading}
            text='Add'
          />
        </DialogFooter>
      </DialogContent>
    </>
  );
}
