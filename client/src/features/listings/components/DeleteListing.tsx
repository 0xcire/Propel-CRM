import { useState } from 'react';

import { useDeleteListing } from '../hooks/useDeleteListing';

import { Button } from '@/components/ui/button';
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

export function DeleteListing({
  listingID,
}: {
  listingID: number;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const deleteListing = useDeleteListing();

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          className='mr-auto'
          variant='destructive'
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            listing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <SubmitButton
              variant='destructive'
              text='Remove'
              isLoading={deleteListing.isLoading}
              onClick={(): void =>
                deleteListing.mutate(listingID, {
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
