import { MoreHorizontal } from 'lucide-react';

import { toast } from '@/components/ui/use-toast';

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
              onClick={(): Promise<void> => {
                toast({
                  description: `Contact ID: ${contact.id} copied to clipboard`,
                });
                return navigator.clipboard.writeText(contact.id.toString());
              }}
            >
              Copy contact ID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UpdateContact
                text='Update'
                contact={contact}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e): void => {
                e.stopPropagation();
              }}
            >
              <RemoveContact
                text='Delete'
                contact={contact}
              />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className='cursor-pointer'
              // onClick={(e): void => {
              //   e.stopPropagation();
              // }}
            >
              Add Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
