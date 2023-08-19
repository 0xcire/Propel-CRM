import { Control, ControllerRenderProps, FieldValues, Path } from 'react-hook-form'

import { FormControl, FormField, FormItem } from "./ui/form";
import { Checkbox } from '@/components/ui/checkbox';
import { type CheckedState } from '@radix-ui/react-checkbox';

export type CheckedChangeParams<TFieldValues extends FieldValues> = {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
  checked: CheckedState,
}

type FormCheckboxInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  handleOnCheckedChange: ({ field, checked }: CheckedChangeParams<TFieldValues>) => void
}

export function FormCheckboxInput<TFieldValues extends FieldValues>({
  control,
  name,
  handleOnCheckedChange,
}: FormCheckboxInputProps<TFieldValues>): JSX.Element {


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <FormItem>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked: CheckedState): void => {
                handleOnCheckedChange({ field, checked });
              }}
              className='mt-[5px] rounded-full outline-red-900'
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
