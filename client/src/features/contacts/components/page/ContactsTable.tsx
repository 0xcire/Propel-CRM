import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

import type { Dispatch, SetStateAction } from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import type { Contact } from '../../types';

interface ContactTableProps<TData extends Contact> {
  columns: Array<ColumnDef<Contact>>;
  data: Array<TData>;
  isLoading: boolean;
  isFetching: boolean;
  nameQuery: string | undefined;
  setNameQuery: Dispatch<SetStateAction<string | undefined>>;
}

// cant see use case for TValue
export function ContactTable<TData extends Contact>({
  columns,
  data,
  isLoading,
  isFetching,
  nameQuery,
  setNameQuery,
}: ContactTableProps<TData>): JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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

  // TODO: remove table flash on search, loading should only take over table content

  if ((!data && isLoading) || (!data && isFetching)) {
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
      <div className='flex items-center p-4'>
        <Input
          autoFocus={true}
          placeholder='Search your contacts'
          value={nameQuery ?? ''}
          onChange={(e): void => {
            setNameQuery(e.currentTarget.value);
          }}
          className='max-w-sm'
        />
        <div className='ml-auto flex items-center gap-2'>
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

      {isLoading || isFetching ? (
        <div className='grid h-full w-full flex-1 place-items-center'>
          <Spinner
            className='mx-auto'
            variant='md'
          />
        </div>
      ) : (
        <div className='mx-4 flex-1 overflow-auto rounded-md border shadow'>
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
                      navigate(`/contacts/${row.original.id}`);
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
      )}

      <div className='flex items-center justify-end space-x-2 p-4'>
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
            setSearchParams([['page', (+currentPage - 1).toString()]]);
          }}
          disabled={searchParams.get('page') === '1'}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={(): void => {
            setSearchParams([['page', (+currentPage + 1).toString()]]);
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