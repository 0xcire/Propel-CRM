import type { ComponentProps, ReactElement } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

interface TextInputProps<TFieldValues extends FieldValues>
  extends ComponentProps<'input'> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
}

export function TextInput<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  ...props
}: TextInputProps<TFieldValues>): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }): ReactElement => (
        <FormItem className='w-full'>
          <FormLabel>{label ? label : field.name}</FormLabel>
          <FormControl>
            <Input
              disabled={props.disabled}
              type={props.type}
              placeholder={props.placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
