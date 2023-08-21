import { ComponentProps } from 'react';
import type { Control, FieldValues, Path, PathValue } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SelectInputProps<
  TFieldValues extends FieldValues,
  OptionType extends PathValue<TFieldValues, Path<TFieldValues>>,
  OptionTypeArray extends Readonly<Array<OptionType>>
> extends ComponentProps<'select'> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  options: OptionTypeArray;
  placeholder: string;
}

export function SelectInput<
  TFieldValues extends FieldValues,
  OptionType extends PathValue<TFieldValues, Path<TFieldValues>>,
  OptionTypeArray extends Readonly<Array<OptionType>>
>({
  control,
  name,
  options,
  placeholder,
}: SelectInputProps<TFieldValues, OptionType, OptionTypeArray>): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <FormItem>
          <Select
            onValueChange={(val): void => field.onChange(val as OptionType)}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
