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
import { twMerge } from 'tailwind-merge';

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
        <FormItem className='flex flex-1 flex-col'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='flex flex-1 items-center gap-8'>
              <Textarea
                placeholder={props.placeholder}
                className={twMerge('h-full resize-none', props.className)}
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
