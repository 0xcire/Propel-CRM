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

import { ScrollArea } from '@/components/ui/scroll-area';
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
import { DataTableFilter } from '@/components/ui/table/data-table-filter';

import { Spinner } from '@/components';
import { LimitSelection } from '@/components/Table/';

import type { Dispatch, SetStateAction } from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import type { Task } from '../../types';

interface ContactTableProps<TData extends Task> {
  columns: Array<ColumnDef<Task>>;
  data: Array<TData>;
  isLoading: boolean;
  isFetching: boolean;
  setQuery: Dispatch<SetStateAction<string | undefined>>;
}

export function TasksTable<TData extends Task>({
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
    manualFiltering: true,
    pageCount: -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const title = searchParams.get('title');
  const currentPage: string = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '10';

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
      <div className='flex items-center gap-2 py-4'>
        <Input
          ref={inputRef}
          autoFocus={true}
          placeholder='Search your tasks'
          className='max-w-sm'
          onChange={(e): void => setQuery(e.currentTarget.value)}
          onKeyUp={(e): void => {
            if (e.key === 'Backspace' && e.currentTarget.value === '') {
              searchParams.delete('title');
              setSearchParams(searchParams);
            }
          }}
        />

        {title && (
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

        <Button
          variant='outline'
          onClick={(): void => {
            searchParams.set('page', '1');
            searchParams.set(
              'completed',
              searchParams.get('completed') === 'true' ? 'false' : 'true'
            );
            setSearchParams(searchParams);
          }}
        >
          {searchParams.get('completed') === 'true'
            ? 'Hide Completed'
            : 'Show Completed'}
        </Button>

        <DataTableFilter
          title='Priority'
          column={table.getColumn('priority')}
          options={[
            {
              label: 'Low',
              value: 'low',
            },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ]}
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
        <Spinner
          variant='md'
          fillContainer
        />
      ) : (
        <ScrollArea className='flex-1 rounded-md border shadow'>
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
            disabled={data.length < +limit}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
