import { Link } from 'react-router-dom';

import { formatDateString } from '@/utils/intl';

import { MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { TaskCheckbox } from '../components/TaskCheckbox';
import { DeleteTask } from '../components/DeleteTask';

import type { ColumnDef } from '@tanstack/react-table';
import type { Task } from '../types';

export const taskColumns: Array<ColumnDef<Task>> = [
  {
    id: 'select',
    cell: ({ row }): JSX.Element => {
      const task = row.original;

      return (
        <TaskCheckbox
          taskID={task.id}
          completed={task.completed as boolean}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }): JSX.Element => {
      return <p className='line-clamp-3'>{row.getValue('description')}</p>;
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
  },
  {
    accessorKey: 'dueDate',
    header: 'Due',
    cell: ({ row }): JSX.Element => {
      const dueDate: string = row.getValue('dueDate');

      return dueDate ? <p>{formatDateString(dueDate)}</p> : <></>;
    },
  },

  {
    id: 'actions',
    cell: ({ row }): JSX.Element => {
      const task = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0'
            >
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              className='cursor-pointer'
              asChild
            >
              <Link to={`/tasks/${task.id}`}>Update</Link>
            </DropdownMenuItem>

            <DeleteTask
              asDropdownMenuItem
              id={task.id}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
