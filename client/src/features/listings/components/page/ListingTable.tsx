import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Spinner } from '@/components';
import { StatusToggle } from './StatusToggle';
import { Table, TableFilterOptions, TableFooter } from '@/components/Table';

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import type { TableProps } from '@/types';
import type { Listing } from '../../types';

type ListingTableProps = TableProps<Listing>;

export function ListingTable({
  columns,
  data,
  isLoading,
  isFetching,
  setQuery,
}: ListingTableProps): JSX.Element {
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
        context='address'
        isSorted={sorting.length >= 1}
        table={table}
        setQuery={setQuery}
      >
        <StatusToggle />
      </TableFilterOptions>

      {isLoading || isFetching ? (
        <Spinner
          variant='md'
          fillContainer
        />
      ) : (
        <>
          <ScrollArea className='flex-1 rounded-md border shadow'>
            <Table
              table={table}
              columns={columns}
            />
          </ScrollArea>
        </>
      )}

      <TableFooter isLastPage={data.length < +limit} />
    </>
  );
}
