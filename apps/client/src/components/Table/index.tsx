import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { TableVirtuoso } from 'react-virtuoso';
import { flexRender } from '@tanstack/react-table';
import {
  Table as TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTableViewOptions } from '../ui/table/data-table-view-options';

import { LimitSelection } from './LimitSelection';
import { PaginationControls } from './PaginationControls';

import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import type { ColumnDef, Table } from '@tanstack/react-table';
import type { TableFooterProps } from './types';

interface TableFilterOptionsProps<TData> extends PropsWithChildren {
  isSorted: boolean;
  context: 'address' | 'name' | 'title';
  table: Table<TData>;
  setQuery: Dispatch<SetStateAction<string | undefined>>;
}

type TableProps<TData> = {
  table: Table<TData>;
  columns?: Array<ColumnDef<TData>>;
  customScrollParent?: HTMLElement | undefined;
};

export function TableFilterOptions<TData>({
  isSorted,
  context,
  table,
  setQuery,
  children,
}: TableFilterOptionsProps<TData>): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className='flex flex-col items-start justify-start gap-y-2 py-4 md:flex-row md:gap-x-2'>
      <Input
        ref={inputRef}
        defaultValue={searchParams.get(context) ?? ''}
        placeholder={`Search by ${context}`}
        onChange={(e): void => setQuery(e.currentTarget.value)}
        onKeyUp={(e): void => {
          if (e.key === 'Backspace' && e.currentTarget.value === '') {
            searchParams.delete(context);
            setSearchParams(searchParams);
          }
        }}
        className='h-9 max-w-3xl'
      />
      {(searchParams.get(context) || isSorted) && (
        <Button
          className='h-full'
          variant='outline'
          onClick={(): void => {
            searchParams.delete(context);
            setSearchParams(searchParams);

            if (isSorted) {
              if (table.getState().sorting.length > 0) {
                table.resetSorting();
              }
              if (Object.keys(table.getState().columnVisibility).length > 0) {
                table.resetColumnVisibility();
              }
            }

            if (inputRef.current && inputRef.current.value !== '') {
              inputRef.current.value = '';
            }
          }}
        >
          Reset
        </Button>
      )}
      <div className='flex flex-wrap items-center gap-2 md:ml-auto md:flex-nowrap'>
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

export function Table<TData>({
  table,
  columns,
}: TableProps<TData>): JSX.Element {
  return (
    <TableRoot>
      <TableHeader className='sticky top-0 bg-background outline outline-2 outline-muted'>
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
              className='row border-border'
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns?.length}
              className='h-24 text-center'
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableRoot>
  );
}

//ref: https://virtuoso.dev/tanstack-table-integration/
export function VirtualTable<TData>({
  table,
  customScrollParent,
}: TableProps<TData>): JSX.Element {
  const { rows } = table.getRowModel();

  return (
    <TableVirtuoso
      className='relative'
      overscan={600}
      customScrollParent={customScrollParent}
      totalCount={rows.length}
      components={{
        Table: ({ style, ...props }): JSX.Element => {
          return (
            <TableRoot
              style={{
                ...style,
                width: '100%',
                // tableLayout: 'fixed',
                borderCollapse: 'collapse',
                borderSpacing: 0,
              }}
              {...props}
            />
          );
        },

        TableRow: (props): JSX.Element => {
          const index = props['data-index'];
          const row = rows[index];

          return (
            <TableRow
              className='row'
              data-state={row?.getIsSelected() && 'selected'}
              {...props}
            >
              {row?.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          );
        },
      }}
      fixedHeaderContent={(): JSX.Element => {
        return (
          <>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className='m-0 w-full bg-background hover:bg-background'
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  console.log(
                    'header',
                    header.headerGroup.headers[header.index]?.getSize()
                  );
                  return (
                    <TableHead
                      style={{
                        width: header.getSize(),
                        textAlign: 'left',
                      }}
                      // rough implementation:
                      // className={
                      //   header.id === 'id' || header.id === 'actions'
                      //     ? 'w-[64px]'
                      //     : header.id === 'address'
                      //     ? 'w-56'
                      //     : 'w-content'
                      // }
                      key={header.id}
                    >
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
          </>
        );
      }}
    />
  );
}

export function TableFooter({ isLastPage }: TableFooterProps): JSX.Element {
  return (
    <div className='flex flex-col items-end justify-between gap-2 py-4 pb-0 sm:flex-row'>
      <LimitSelection className='flex items-center gap-2' />
      <PaginationControls isLastPage={isLastPage} />
    </div>
  );
}
