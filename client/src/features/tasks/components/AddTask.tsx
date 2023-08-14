import { type Dispatch, type SetStateAction } from 'react';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, endOfYesterday, formatISO } from 'date-fns';

import { useCreateTask } from '../hooks/useCreateTask';
import { useUser } from '@/lib/react-query-auth';

import { cn } from '@/lib/utils';

import { CalendarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
            {/* TODO: ControllerProps<TFieldValues, TName> */}
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
