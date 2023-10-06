import { useSearchParams } from 'react-router-dom';

import { CheckCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterDropdownProps = {
  label: string;
};

export function FilterDropdown({ label }: FilterDropdownProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const completedBoolean = JSON.parse(searchParams.get('completed') as string);

  // TODO:
  // https://stackoverflow.com/questions/71973934/how-to-get-all-query-params-using-react-router-dom-v6-usesearchparams-without
  // manual solution will not scale.

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(): void => {
            setSearchParams([
              ['page', '1'],
              ['completed', completedBoolean ? 'false' : 'true'],
            ]);
          }}
          className='cursor-pointer'
        >
          <>
            <CheckCircleIcon
              tabIndex={0}
              size={18}
              className='mr-1 cursor-pointer'
            />
            {!completedBoolean ? 'Hide Completed' : 'Show Completed'}
          </>
        </DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
