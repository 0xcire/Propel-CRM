import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

import { ListingLeadAvatar } from '../components/ListingLeadAvatar';

import { currency, dateIntl, number } from '@/utils/intl';

import type { ColumnDef } from '@tanstack/react-table';
import type { Listing } from '../types';

export const listingColumns: Array<ColumnDef<Listing>> = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'propertyType',
    header: 'Property Type',
    cell: ({ row }): JSX.Element => {
      return <p className='text-center'>{row.getValue('propertyType')}</p>;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }): JSX.Element => {
      return (
        <Button
          variant='ghost'
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Price
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }): JSX.Element => {
      const price: string = row.getValue('price');
      const formatted = currency.format(+price);
      return <p className='text-center'>{formatted.split('.')[0] as string}</p>;
    },
  },
  {
    accessorKey: 'bedrooms',
    header: ({ column }): JSX.Element => {
      return (
        <Button
          variant='ghost'
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Beds
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }): JSX.Element => (
      <p className='text-center'>{row.getValue('bedrooms')}</p>
    ),
  },
  {
    accessorKey: 'baths',
    header: ({ column }): JSX.Element => {
      return (
        <Button
          variant='ghost'
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Baths
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }): JSX.Element => (
      <p className='text-center'>{row.getValue('baths')}</p>
    ),
  },
  {
    accessorKey: 'squareFeet',
    header: ({ column }): JSX.Element => {
      return (
        <Button
          variant='ghost'
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          SqFt
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }): JSX.Element => {
      const sqft: number = row.getValue('squareFeet');
      return <p className='text-center'>{number.format(sqft)}</p>;
    },
  },
  {
    accessorKey: 'contacts',
    header: 'Leads',
    cell: ({ row }): JSX.Element => {
      const leads: Array<{ name: string; email: string; phone: string }> =
        row.getValue('contacts');

      return (
        <div className='line-clamp-1 flex'>
          {leads.map(
            (lead, idx) =>
              lead.name !== null && (
                <ListingLeadAvatar
                  key={`${lead}-${idx}`}
                  contactInfo={lead}
                />
              )
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }): JSX.Element => {
      return (
        <Button
          variant='ghost'
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Listed Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }): JSX.Element => {
      const date = new Date(row.getValue('createdAt'));
      return <p className='text-center'>{dateIntl.format(date)}</p>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }): JSX.Element => {
      const listing = row.original;

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
              onClick={(e): Promise<void> => {
                e.stopPropagation();
                toast({
                  description: `Listing ID: ${listing.id} copied to clipboard`,
                });
                return navigator.clipboard.writeText(listing.id.toString());
              }}
            >
              Copy listing ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
