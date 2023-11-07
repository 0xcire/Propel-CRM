import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
import { ScrollArea } from '@/components/ui/scroll-area';

import { Spinner } from '@/components';
import { LimitSelection } from '@/components/Table/';

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
  setQuery: Dispatch<SetStateAction<string | undefined>>;
}

export function ContactTable<TData extends Contact>({
  columns,
  data,
  isLoading,
  isFetching,
  setQuery,
}: ContactTableProps<TData>): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const inputRef = useRef<HTMLInputElement>(null);

  const name = searchParams.get('name');

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

  const limit = searchParams.get('limit') ?? '10';
  const currentPage: string = searchParams.get('page') ?? '1';

  if ((!data && isLoading) || (!data && isFetching)) {
    return (
      <Spinner
        variant='md'
        fillContainer
      />
    );
  }

  return (
    <>
      <div className='flex items-center py-4'>
        <Input
          ref={inputRef}
          autoFocus={true}
          placeholder='Search your contacts'
          onChange={(e): void => {
            setQuery(e.currentTarget.value);
          }}
          onKeyUp={(e): void => {
            if (e.key === 'Backspace' && e.currentTarget.value === '') {
              searchParams.delete('name');
              setSearchParams(searchParams);
            }
          }}
          className='max-w-sm'
        />
        {name && (
          <Button
            className='ml-4 h-full'
            variant='outline'
            onClick={(): void => {
              searchParams.delete('name');
              setSearchParams(searchParams);

              if (inputRef.current) {
                inputRef.current.value = '';
              }
            }}
          >
            Reset
          </Button>
        )}

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
                      className='cursor-pointer capitalize'
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
        <Spinner
          variant='md'
          fillContainer
        />
      ) : (
        <ScrollArea className='flex-1 overflow-auto rounded-md border shadow'>
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
                    className='row'
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
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
        </ScrollArea>
      )}

      {/* <TableFooter></TableFooter> */}
      <div className='flex items-center justify-between space-x-2 py-4 pb-0'>
        <LimitSelection className='flex items-center gap-4' />
        <div className='flex items-center gap-2'>
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
            {`${+currentPage * +limit - +limit + 1} - ${+currentPage * +limit}`}
          </Typography>
          <Button
            variant='outline'
            size='sm'
            onClick={(): void => {
              searchParams.set('page', (+currentPage - 1).toString());
              setSearchParams(searchParams);
            }}
            disabled={searchParams.get('page') === '1'}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={(): void => {
              searchParams.set('page', (+currentPage + 1).toString());
              setSearchParams(searchParams);
            }}
            disabled={data.length < +limit || !!name}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
