import { Control, FieldValues, Path, PathValue } from 'react-hook-form';

import { FormControl, FormField, FormItem } from '../ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { type CheckedState } from '@radix-ui/react-checkbox';

type CheckboxInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  handleOnCheckedChange?: (checked: CheckedState) => void;
};

export function CheckboxInput<TFieldValues extends FieldValues>({
  control,
  name,
  handleOnCheckedChange,
}: CheckboxInputProps<TFieldValues>): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }): JSX.Element => (
        <FormItem className='mt-[2px] flex h-full space-y-0'>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked: CheckedState): void => {
                field.onChange(
                  checked as PathValue<TFieldValues, Path<TFieldValues>>
                );
                if (handleOnCheckedChange) {
                  handleOnCheckedChange(checked);
                }
              }}
              className='rounded-full outline-red-900'
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
