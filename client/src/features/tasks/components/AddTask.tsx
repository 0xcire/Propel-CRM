import { useState } from 'react';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, endOfYesterday } from 'date-fns';

import { useCreateTask } from '../hooks/useCreateTask';
import { useUser } from '@/lib/react-query-auth';

import { CalendarIcon, PlusIcon } from 'lucide-react';
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

// id: number;
// createdAt: Date | null;
// userID: number | null;
// title: string;
// description: string | null;
// notes: string | null;
// dueDate: Date | null;
// completed: boolean | null;
// status: 'completed' | 'in progress' | 'not started';
// priority: 'low' | 'medium' | 'high';

const statusOptions = ['completed', 'in progress', 'not started'] as const;
const priorityOptions = ['low', 'medium', 'high'] as const;

type Status = (typeof statusOptions)[number];
type Priority = (typeof priorityOptions)[number];

// const AddTaskSchema = z.object({
//   //   userID: z.number(),
//   title: z.string(),
//   description: z
//     .string()
//     .optional()
//     .transform((e) => (e === '' ? undefined : e)),
//   notes: z
//     .string()
//     .optional()
//     .transform((e) => (e === '' ? undefined : e)),
//   dueDate: z
//     .union([z.date(), z.string()])
//     .optional()
//     .transform((e) => (e === 'dueDate' ? undefined : e)),
//   completed: z
//     .union([z.boolean(), z.string()])
//     .optional()
//     .transform((e) => (e === 'completed' ? undefined : e)),
//   status: z.enum(statusOptions),
//   priority: z.enum(priorityOptions),
// });

const AddTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  notes: z.string(),
  dueDate: z.union([z.date(), z.undefined()]),
  completed: z.boolean(),
  status: z.union([z.enum(statusOptions), z.undefined()]),
  priority: z.union([z.enum(priorityOptions), z.undefined()]),
});
type AddTaskFields = z.infer<typeof AddTaskSchema>;

export function AddTask(): JSX.Element {
  const [open, setOpen] = useState(false);

  const createTask = useCreateTask();

  const user = useUser();

  const form = useForm<AddTaskFields>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      notes: '',
      dueDate: undefined,
      completed: false,
      status: undefined,
      priority: undefined,
    },
  });

  function onSubmit(values: AddTaskFields): void {
    const data = {
      uesrID: user.data?.id,
      ...values,
    };
    console.log(data);
    createTask.mutate(data, {
      onSuccess: () => setOpen(false),
    });
  }
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <PlusIcon
          className='cursor-pointer'
          size={20}
          tabIndex={0}
        />
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
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
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dueDate'
              render={({ field }): JSX.Element => (
                <FormItem className='flex items-center justify-between space-y-0 pt-2'>
                  <FormLabel>Due Date</FormLabel>
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
                            <span>Pick a date</span>
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
              name='status'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(val): void => field.onChange(val as Status)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Set task status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priority'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={(val): void =>
                      field.onChange(val as Priority)
                    }
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Set task priority' />
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
          </form>
        </Form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant='outline'>Close</Button>
          </DialogTrigger>
          <SubmitButton
            disabled={
              !Object.keys(form.formState.dirtyFields).includes('title')
            }
            form='add-task'
            isLoading={false}
            text='Add'
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
