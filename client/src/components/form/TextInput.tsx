import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

import type { ComponentProps, ReactElement, ChangeEvent } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

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
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                const value = e.target.value;
                field.onChange(typeof value === 'number' ? e.toString() : e);
              }}
              value={field.value}
              onBlur={field.onBlur}
              ref={field.ref}
              name={field.name}
              // {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
