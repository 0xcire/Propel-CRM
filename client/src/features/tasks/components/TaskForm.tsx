import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeepPartial, useForm } from 'react-hook-form';

import { parseISO } from 'date-fns';

import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  CheckboxInput,
  DateInput,
  SelectInput,
  TextAreaInput,
  TextInput,
} from '@/components/form';
import { SubmitButton } from '@/components';

import { DeleteTask } from './DeleteTask';

import { taskSchema, checkboxSchema } from '@/lib/validations/tasks';
import { priorityOptions } from '@/config';

import { removeTimeZone } from '@/utils/date';
import { fieldsAreDirty } from '@/utils/form-data';

import type { FormMode } from '@/types';
import type { Priority, Task } from '../types';
import type { CheckedState } from '@radix-ui/react-checkbox';

interface TaskFormProps extends FormMode {
  isCheckbox?: boolean;
  task?: Task;
  defaultValues: DeepPartial<CreateTask | Checkbox>;
  onSubmit?: (values: CreateTaskFields) => void;
  handleOnCheckedChange?: (checked: CheckedState) => void;
}

export type CreateTaskFields = z.infer<typeof taskSchema>;
type CreateTask = {
  completed: never;
} & CreateTaskFields;

export type CheckboxSchema = z.infer<typeof checkboxSchema>;
type Checkbox = {
  title: never;
  description: never;
  notes: never;
  dueDate: never;
  priority: never;
} & CheckboxSchema;

export function TaskForm({
  isCreate,
  task,
  isLoading,
  isCheckbox,
  defaultValues,
  onSubmit,
  handleOnCheckedChange,
}: TaskFormProps): JSX.Element {
  const form = useForm<CreateTaskFields>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues,
  });

  const checkboxForm = useForm<CheckboxSchema>({
    resolver: zodResolver(checkboxSchema),
    defaultValues: defaultValues,
  });

  const titleIsEmpty = fieldsAreDirty<CreateTaskFields>(form, 'title');

  useEffect(() => {
    if (!isCreate && task) {
      form.reset({
        title: task.title,
        description: task.description ? task.description : '',
        notes: task.notes ? task.notes : '',
        dueDate: task.dueDate
          ? parseISO(removeTimeZone(task.dueDate))
          : undefined,
        priority: task.priority ? task.priority : undefined,
      });
    }
    if (isCreate) {
      form.reset();
    }
  }, [task, form, isCreate]);

  if (isCheckbox) {
    return (
      <Form {...checkboxForm}>
        <form>
          <CheckboxInput
            name='completed'
            handleOnCheckedChange={handleOnCheckedChange}
            control={checkboxForm.control}
          />
        </form>
      </Form>
    );
  }

  return (
    <>
      <Form {...form}>
        <form
          id={isCreate ? 'add-task' : 'update-task'}
          onSubmit={onSubmit && form.handleSubmit(onSubmit)}
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

            <SelectInput<CreateTaskFields, Priority, typeof priorityOptions>
              name='priority'
              placeholder='Priority'
              options={priorityOptions}
              control={form.control}
            />
          </div>
        </form>
      </Form>
      <DialogFooter>
        {!isCreate && <DeleteTask id={task?.id as number} />}
        <DialogTrigger asChild>
          <Button variant='outline'>Close</Button>
        </DialogTrigger>
        <SubmitButton
          disabled={isCreate ? !titleIsEmpty : !form.formState.isDirty}
          form={isCreate ? 'add-task' : 'update-task'}
          isLoading={isLoading}
          text='Add'
        />
      </DialogFooter>
    </>
  );
}
