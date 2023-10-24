import { useState } from 'react';

import { useDeleteContact } from '../hooks/useDeleteContact';

import { Trash2Icon } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
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

import { handleOnOpenChange } from '@/utils';

import type { ContactAsProp } from '../types';

interface RemoveContactProps extends ContactAsProp {
  asDropdownMenuItem?: boolean;
}

export function RemoveContact({
  contact,

  asDropdownMenuItem,
}: RemoveContactProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const deleteContact = useDeleteContact();

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open): void => handleOnOpenChange(open, setOpen)}
    >
      <AlertDialogTrigger asChild>
        {asDropdownMenuItem ? (
          <DropdownMenuItem
            className='cursor-pointer'
            onSelect={(e): void => e.preventDefault()}
          >
            Delete
          </DropdownMenuItem>
        ) : (
          <Trash2Icon
            className='cursor-pointer'
            size={18}
            tabIndex={0}
          />
        )}
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
