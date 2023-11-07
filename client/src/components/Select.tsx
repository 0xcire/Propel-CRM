import {
  Select as SelectRoot,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { ComponentProps } from 'react';

interface SelectProps extends ComponentProps<typeof SelectValue> {
  options: Readonly<Array<string>>;
  label?: string;
  handleSelectChange?: (value: string) => void;
}

export function Select({
  options,
  label,
  handleSelectChange,
  ...props
}: SelectProps): JSX.Element {
  return (
    <SelectRoot
      defaultValue={props.defaultValue?.toString()}
      onValueChange={handleSelectChange}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={props.placeholder ?? null} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectRoot>
  );
}
