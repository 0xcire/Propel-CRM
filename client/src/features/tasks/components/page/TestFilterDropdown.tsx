//https://github.com/shadcn-ui/ui/blob/main/apps/www/app/examples/tasks/components/data-table-faceted-filter.tsx

// shadcn ui componenent,
// move to @/components/ui/table

import * as React from 'react';

import { Column } from '@tanstack/react-table';
import { PlusCircleIcon, CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'react-router-dom';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

// DataTableFacetedFilter
export function TestFilterDropdown<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const generatePriorityFilterQueryParam = (): string => {
    let query = '';

    if (selectedValues.size === 1) {
      query = selectedValues.values().next().value;
    }

    if (selectedValues.size >= 2) {
      selectedValues.forEach((value) => (query += `,${value}`));
    }

    if (query.startsWith(',')) {
      query = query.slice(1, query.length);
    }

    return query;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className=''
        >
          <PlusCircleIcon className='mr-2 h-4 w-4' />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator
                orientation='vertical'
                className='mx-2 h-4'
              />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedValues.size}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.value}
                        className='rounded-sm px-1 font-normal'
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[200px] p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={(): void => {
                      if (isSelected) {
                        selectedValues.delete(option.value);

                        if (selectedValues.size === 0) {
                          searchParams.delete('priority');
                          setSearchParams(searchParams);
                        }
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );

                      if (selectedValues.size >= 1) {
                        searchParams.set(
                          'priority',
                          generatePriorityFilterQueryParam()
                        );
                        setSearchParams(searchParams);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'text-primary-foreground bg-primary'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <option.icon className='text-muted-foreground mr-2 h-4 w-4' />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={(): void => {
                      column?.setFilterValue(undefined);
                      searchParams.delete('priority');
                      setSearchParams(searchParams);
                    }}
                    className='justify-center text-center'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
