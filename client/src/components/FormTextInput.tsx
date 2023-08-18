import type { ComponentProps, ReactElement } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

// TextInput
// TextAreaInput
// DateInput
// Checkbox Input

interface FormTextInputProps<TFieldValues extends FieldValues>
  extends ComponentProps<'input'> {
  control: Control<TFieldValues>;
  inputName: Path<TFieldValues>;
}

export function FormTextInput<TFieldValues extends FieldValues>({
  inputName,
  control,
  ...props
}: FormTextInputProps<TFieldValues>): JSX.Element {
  return (
    <FormField
      control={control}
      name={inputName}
      render={({ field }): ReactElement => (
        <FormItem>
          <FormLabel>{field.name}</FormLabel>
          <FormControl>
            <Input
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
