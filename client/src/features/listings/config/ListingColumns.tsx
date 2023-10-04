import { lazyImport } from '@/utils/lazyImport';

import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

import { ListingLeadAvatar } from '../components/ListingLeadAvatar';

const { AddLead } = lazyImport(
  () => import('../components/page/AddLead'),
  'AddLead'
);

import { currency, dateIntl, number } from '@/utils/intl';

import type { ColumnDef } from '@tanstack/react-table';
import type { Listing } from '../types';
import { Link } from 'react-router-dom';

type ContactInfo = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

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
          onClick={(): void => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
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
    sortingFn: (rowA, rowB, columnId): number => {
      const rowAValue: string = rowA.getValue(columnId);
      const rowBValue: string = rowB.getValue(columnId);

      const priceA: number = +(rowAValue.split('.')[0] as string);
      const priceB: number = +(rowBValue.split('.')[0] as string);

      if (priceA === priceB) {
        return 0;
      }

      return priceA > priceB ? 1 : -1;
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
      const leads: Array<ContactInfo> = row.getValue('contacts');
      const listing = row.original;

      return (
        <div className='line-clamp-1 flex items-center justify-start'>
          {leads.map(
            (lead, idx) =>
              lead.name !== null && (
                <ListingLeadAvatar
                  key={`${lead}-${idx}`}
                  contactInfo={lead}
                  listingID={listing.id}
                  onClick={(e): void => e.stopPropagation()}
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
          <DropdownMenuContent
            onClick={(e): void => e.stopPropagation()}
            align='end'
          >
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
            <DropdownMenuItem
              onClick={(e): void => {
                e.stopPropagation();
              }}
            >
              Update
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e): void => {
                e.stopPropagation();
              }}
            >
              Delete
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
            // onClick={(e): void => {
            //   e.stopPropagation();
            // }}
            >
              <AddLead
                listingID={listing.id}
                onClick={(e): void => e.stopPropagation()}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={(e): void => {
                e.stopPropagation();
              }}
            >
              Add Task
            </DropdownMenuItem>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={(e): void => {
                e.stopPropagation();
              }}
              asChild
            >
              {/* TODO: this */}
              <Link to={`/tasks/listings/${listing.id}`}>View Tasks</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
