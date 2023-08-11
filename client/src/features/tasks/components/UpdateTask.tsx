import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, endOfYesterday, parseISO } from 'date-fns';

import { useUpdateTask } from '../hooks/useUpdateTask';
import { useUser } from '@/lib/react-query-auth';
import { removeTimeZone } from '@/utils/date';

import type { Task as TaskData } from '../types';

import { CalendarIcon, InfoIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components';

import { cn } from '@/lib/utils';

import { Textarea } from '@/components/ui/textarea';

import { priorityOptions } from '@/config';
import type { Priority } from '../types';
import { DeleteTask } from './DeleteTask';

const AddTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  notes: z.string(),
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
      description: task.description ? task.description : '',
      notes: task.notes ? task.notes : '',
      dueDate: task.dueDate
        ? new Date(removeTimeZone(task.dueDate))
        : undefined,
      completed: task.completed,
      priority: task.priority ? task.priority : undefined,
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
            <FormField
              control={form.control}
              name='title'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-8'>
                      <Input {...field} />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-8'>
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notes'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-8'>
                      <Textarea
                        placeholder=''
                        className='resize-none'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-between pt-4'>
              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }): JSX.Element => (
                  <FormItem className='flex items-center justify-between space-y-0 pt-0'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'mt-0 w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Due Date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-0'
                        align='start'
                      >
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date): boolean => date < endOfYesterday()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='priority'
                render={({ field }): JSX.Element => (
                  <FormItem>
                    <Select
                      onValueChange={(val): void =>
                        field.onChange(val as Priority)
                      }
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Priority' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((priority) => (
                          <SelectItem
                            key={priority}
                            value={priority}
                          >
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
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
