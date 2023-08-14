import { useState } from 'react';

import { useDeleteContact } from '../hooks/useDeleteContact';

import { Trash2Icon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SubmitButton } from '@/components';

import type { ContactAsProp } from '../types';

// TODO: change this to normal dialog?
export function RemoveContact({ contact }: ContactAsProp): JSX.Element {
  const [open, setOpen] = useState(false);

  const deleteContact = useDeleteContact();

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Trash2Icon
          className='cursor-pointer'
          size={18}
          tabIndex={0}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <span className='font-black'>{contact.name} </span>
            from your network.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <SubmitButton
              variant='destructive'
              text='Remove'
              isLoading={deleteContact.isLoading}
              onClick={(): void =>
                deleteContact.mutate(contact.id, {
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
