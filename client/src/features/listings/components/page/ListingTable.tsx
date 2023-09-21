import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useListingContext } from '../../context/ListingPageContext';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Spinner } from '@/components';
import { StatusToggle } from './StatusToggle';

import type { ChangeEvent } from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import type { Listing } from '../../types';

// sold listings need a contact field like a sold_to column

interface ListingTableProps<TData extends Listing> {
  columns: Array<ColumnDef<Listing>>;
  data: Array<TData>;
  isLoading: boolean;
  isFetching: boolean;
}

// cant see use case for TValue
export function ListingTable<TData extends Listing>({
  columns,
  data,
  isLoading,
  isFetching,
}: ListingTableProps<TData>): JSX.Element {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { searchParams, setSearchParams } = useListingContext();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount: -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const currentPage: string = searchParams.get('page') ?? '1';

  if (isLoading || isFetching) {
    return (
      <div className='grid h-full w-full flex-1 place-items-center'>
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Search by address'
          value={(table.getColumn('address')?.getFilterValue() as string) ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            table.getColumn('address')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <div className='ml-auto flex items-center gap-2'>
          <StatusToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='ml-auto'
              >
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value): void =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='flex-1 overflow-auto rounded-md border shadow'>
        <Table>
          <TableHeader className='w-full'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className='row cursor-pointer'
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={(): void => {
                    navigate(`/listings/${row.original.id}`, {
                      state: {
                        query: searchParams,
                      },
                    });
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Typography
          variant='p'
          className='text-sm'
        >
          Page: {currentPage}
        </Typography>
        <Typography
          variant='p'
          className='text-sm'
        >
          {`${+currentPage * 10 - 10 + 1} - ${+currentPage * 10}`}
        </Typography>
        <Button
          variant='outline'
          size='sm'
          onClick={(): void => {
            const status = searchParams.get('status');
            setSearchParams([
              ['page', (+currentPage - 1).toString()],
              ['status', status as string],
            ]);
          }}
          disabled={searchParams.get('page') === '1'}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={(): void => {
            const status = searchParams.get('status');
            setSearchParams([
              ['page', (+currentPage + 1).toString()],
              ['status', status as string],
            ]);
          }}
          // 10 could be a dynamic 'results per page' number
          disabled={data.length < 10}
        >
          Next
        </Button>
      </div>
    </>
  );
}
