import { useState } from 'react';

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
import { Trash2Icon } from 'lucide-react';
import { useRemoveLead } from '../../hooks/useRemoveLead';
import type { ContactInfo } from '../../types';

export function RemoveLead({
  contactInfo,
  listingID,
}: {
  listingID: number;
  contactInfo: ContactInfo;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const removeLead = useRemoveLead();

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Trash2Icon
          onClick={(e): void => e.stopPropagation()}
          className='cursor-pointer'
          size={16}
          tabIndex={0}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove{' '}
            <span className='font-black'>{contactInfo.name} </span>
            from your lead list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <SubmitButton
              variant='destructive'
              text='Remove'
              isLoading={removeLead.isLoading}
              onClick={(e): void => {
                e.stopPropagation();
                removeLead.mutate(
                  {
                    listingID: listingID,
                    contactID: contactInfo.id,
                  },
                  {
                    onSuccess: () => setOpen(false),
                  }
                );
              }}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
