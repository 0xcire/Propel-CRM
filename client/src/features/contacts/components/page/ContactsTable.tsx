import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/Spinner';
import { Table, TableFilterOptions, TableFooter } from '@/components/Table/';

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import type { TableProps } from '@/types';
import type { Contact } from '../../types';

type ContactTableProps = TableProps<Contact>;

export function ContactTable({
  columns,
  data,
  isLoading,
  isFetching,
  setQuery,
}: ContactTableProps): JSX.Element {
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
        context='name'
        isSorted={sorting.length >= 1}
        setQuery={setQuery}
        table={table}
      />

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
