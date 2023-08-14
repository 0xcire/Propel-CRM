import { useState } from 'react';

import { useDeleteTask } from '../hooks/useDeleteTask';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { SubmitButton } from '@/components';

// TODO: may need to change to regular dialog
export function DeleteTask({ id }: { id: number }): JSX.Element {
  const [open, setOpen] = useState(false);
  const deleteTask = useDeleteTask();
  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant='destructive'
          className='mr-auto'
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <SubmitButton
              variant='destructive'
              text='Remove'
              isLoading={deleteTask.isLoading}
              onClick={(): void =>
                deleteTask.mutate(id, {
                  onSuccess: () => setOpen(false),
                })
              }
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
