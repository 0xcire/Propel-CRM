import type { ComponentProps } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface TextAreaProps<TFieldValues extends FieldValues>
  extends ComponentProps<'textarea'> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
}

export function TextAreaInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  ...props
}: TextAreaProps<TFieldValues>): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='flex items-center gap-8'>
              <Textarea
                placeholder={props.placeholder}
                className='resize-none'
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
