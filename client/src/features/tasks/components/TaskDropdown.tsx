import { type Dispatch, type SetStateAction } from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AddTask } from '@/features/tasks/components/AddTask';
import { MoreVerticalIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

export function TaskDropdown({
  showCompleted,
  setShowCompleted,
}: {
  showCompleted: boolean;
  setShowCompleted: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const [open, setOpen] = useState(false);

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
            Show Completed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddTask setOpen={setOpen} />
    </Dialog>
  );
}
