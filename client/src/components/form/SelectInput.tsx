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

interface SelectInputProps<
  TFieldValues extends FieldValues,
  OptionType extends PathValue<TFieldValues, Path<TFieldValues>>,
  OptionTypeArray extends Readonly<Array<OptionType>>
> extends ComponentProps<'select'> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  options: OptionTypeArray | undefined;
  label?: string;
  placeholder: string;
}

// TODO: how can i potentially reduce the complexity here?
// also ensure typesafety when using <SelectInput<FormSchema, Type, Type> />?

export function SelectInput<
  TFieldValues extends FieldValues,
  OptionType extends PathValue<TFieldValues, Path<TFieldValues>>,
  OptionTypeArray extends Readonly<Array<OptionType>>
>({
  control,
  name,
  options,
  label,
  placeholder,
}: SelectInputProps<TFieldValues, OptionType, OptionTypeArray>): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <FormItem>
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
                    key={option}
                    value={
                      typeof option === 'number' ? option.toString() : option
                    }
                  >
                    {option}
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
