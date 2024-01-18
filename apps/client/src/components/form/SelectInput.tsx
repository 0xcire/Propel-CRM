import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import type { ComponentProps } from 'react';
import type { Control, FieldValues, Path, PathValue } from 'react-hook-form';

// hmm.. ? struggling with types here..

interface SelectInputProps<
  TFieldValues extends FieldValues,
  OptionType extends PathValue<TFieldValues, Path<TFieldValues>>
> extends ComponentProps<'select'> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  options: Array<{
    value: unknown; // could potentially have dates, etc in future
    text: OptionType;
  }>;
  label?: string;
  placeholder: string;
}

export function SelectInput<
  TFieldValues extends FieldValues,
  OptionType extends PathValue<TFieldValues, Path<TFieldValues>>
>({
  control,
  name,
  options,
  label,
  placeholder,
}: SelectInputProps<TFieldValues, OptionType>): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <FormItem className='space-y-0 sm:space-y-1'>
          <FormLabel>{label ? label : field.name}</FormLabel>
          <Select
            onValueChange={(val): void => {
              field.onChange(val as OptionType);
            }}
            defaultValue={
              typeof field.value === 'number'
                ? field.value.toString()
                : field.value
            }
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options ? (
                options.map((option) => (
                  <SelectItem
                    key={option.text}
                    value={
                      typeof option.value === 'number'
                        ? option.value.toString()
                        : (option.value as string)
                    }
                  >
                    {option.text}
                  </SelectItem>
                ))
              ) : (
                <></>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
