import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTaskContext } from '../../context/TaskContext';
import { CheckCircleIcon } from 'lucide-react';

type FilterDropdownProps = {
  label: string;
};

export function FilterDropdown({ label }: FilterDropdownProps): JSX.Element {
  const { state: showCompleted, setState: setShowCompleted } = useTaskContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(): void => setShowCompleted(!showCompleted)}
          className='cursor-pointer'
        >
          <>
            <CheckCircleIcon
              tabIndex={0}
              size={18}
              className='mr-1 cursor-pointer'
            />
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </>
        </DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
