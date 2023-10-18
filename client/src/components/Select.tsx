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

interface SelectProps extends ComponentProps<'select'> {
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
    <SelectRoot onValueChange={handleSelectChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={props.placeholder} />
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
