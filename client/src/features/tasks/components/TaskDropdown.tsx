import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

import { MoreVerticalIcon, PlusIcon, CheckCircleIcon } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AddTask } from '@/features/tasks/components/AddTask';

export function TaskDropdown(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { state: showCompleted, setState: setShowCompleted } = useTaskContext();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVerticalIcon
            tabIndex={0}
            className='cursor-pointer'
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem className='cursor-pointer'>
              <>
                <PlusIcon size={18} />
                Add Task
              </>
            </DropdownMenuItem>
          </DialogTrigger>

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
      <AddTask setOpen={setOpen} />
    </Dialog>
  );
}
