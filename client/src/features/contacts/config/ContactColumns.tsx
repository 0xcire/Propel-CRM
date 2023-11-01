import { Link } from 'react-router-dom';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { RemoveContact } from '../components/RemoveContact';
import { UpdateContact } from '../components/UpdateContact';

import type { ColumnDef } from '@tanstack/react-table';
import type { Contact } from '../types';
import { AddTask } from '@/features/common/tasks/components/AddTask';

export const listingColumns: Array<ColumnDef<Contact>> = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone #',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    id: 'actions',
    cell: ({ row }): JSX.Element => {
      const contact = row.original;

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
              <Link to={`/contacts/${contact.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <UpdateContact
              asDropdownMenuItem
              contact={contact}
            />
            <RemoveContact
              asDropdownMenuItem
              contact={contact}
            />
            <DropdownMenuSeparator />

            <AddTask
              asDropdownMenuItem
              contactID={contact.id}
            >
              Add new task for {contact.name}
            </AddTask>

            <DropdownMenuItem
              className='cursor-pointer'
              asChild
            >
              <Link to={`/tasks/contacts/${contact.id}?page=1&completed=false`}>
                View Tasks
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
