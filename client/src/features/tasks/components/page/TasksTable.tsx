import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTableFilter } from '@/components/ui/table/data-table-filter';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { Spinner } from '@/components';
import { CompletedToggle } from './CompletedToggle';
import { Table, TableFilterOptions, TableFooter } from '@/components/Table/';

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import type { TableProps } from '@/types';
import type { Task } from '../../types';

type TaskTableProps = TableProps<Task>;

export function TasksTable({
  columns,
  data,
  isLoading,
  isFetching,
  setQuery,
}: TaskTableProps): JSX.Element {
  const [searchParams] = useSearchParams();
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
    manualFiltering: true,
    pageCount: -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

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
      <TableFilterOptions
        table={table}
        isSorted={sorting.length >= 1}
        context='title'
        setQuery={setQuery}
      >
        <CompletedToggle />

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
      </TableFilterOptions>

      {isLoading || isFetching ? (
        <Spinner
          variant='md'
          fillContainer
        />
      ) : (
        <ScrollArea className='flex-1 rounded-md border border-border shadow'>
          <Table
            table={table}
            columns={columns}
          />
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      )}

      <TableFooter isLastPage={data.length < +limit} />
    </>
  );
}
