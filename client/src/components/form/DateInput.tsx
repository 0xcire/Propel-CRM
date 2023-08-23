import { endOfYesterday, format } from 'date-fns';

import { CalendarIcon } from 'lucide-react';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';

import { cn } from '@/lib/utils';

import type { CalendarProps } from '../ui/calendar';
import type { Control, FieldValues, Path, PathValue } from 'react-hook-form';

type DateInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
} & CalendarProps;

export function DateInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
}: DateInputProps<TFieldValues>): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <FormItem className='flex items-center justify-between space-y-0 pt-0'>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'mt-0 w-[240px] pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>{label}</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0'
              align='start'
            >
              <Calendar
                mode='single'
                selected={field.value}
                onSelect={
                  field.onChange as PathValue<TFieldValues, Path<TFieldValues>>
                }
                disabled={(date): boolean => date < endOfYesterday()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
