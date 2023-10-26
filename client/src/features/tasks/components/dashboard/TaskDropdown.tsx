import { useTaskContext } from '../../context/TaskContext';

import { MoreVerticalIcon, CheckCircleIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AddTask } from '@/features/tasks/components/AddTask';

export function TaskDropdown(): JSX.Element {
  const { showCompleted, setShowCompleted } = useTaskContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVerticalIcon
          tabIndex={0}
          className='cursor-pointer'
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        data-align='start'
      >
        <DropdownMenuItem>
          <AddTask onDashboard={true} />
        </DropdownMenuItem>

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
