import { useState } from 'react';

import { useDeleteTask } from '../hooks/useDeleteTask';

import { Button } from '@/components/ui/button';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { SubmitButton } from '@/components';

import { handleOnOpenChange } from '@/utils';

export function DeleteTask({
  id,
  asDropdownMenuItem,
}: {
  id: number;
  asDropdownMenuItem?: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const deleteTask = useDeleteTask();

  return (
    <Dialog
      open={open}
      onOpenChange={(open): void => handleOnOpenChange(open, setOpen)}
    >
      <DialogTrigger asChild>
        {asDropdownMenuItem ? (
          <DropdownMenuItem
            onSelect={(e): void => e.preventDefault()}
            className='w-full cursor-pointer'
          >
            Delete
          </DropdownMenuItem>
        ) : (
          <Button
            variant='destructive'
            className='mr-auto'
          >
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogTrigger>

          <SubmitButton
            variant='destructive'
            isLoading={deleteTask.isLoading}
            onClick={(): void =>
              deleteTask.mutate(id, {
                onSuccess: () => {
                  setOpen(false);
                },
              })
            }
          >
            Remove
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
