import { useState } from 'react';

import { useDeleteListing } from '../hooks/useDeleteListing';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { SubmitButton } from '@/components';

export function DeleteListing({
  listingID,
  asDropdownMenuItem,
}: {
  listingID: number;
  asDropdownMenuItem?: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const deleteListing = useDeleteListing();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {asDropdownMenuItem ? (
          <DropdownMenuItem
            onSelect={(e): void => e.preventDefault()}
            className='cursor-pointer'
          >
            Delete
          </DropdownMenuItem>
        ) : (
          <Button
            className='mr-auto'
            variant='destructive'
          >
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            listing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={(): void => setOpen(false)}
          >
            Cancel
          </Button>

          <SubmitButton
            variant='destructive'
            isLoading={deleteListing.isLoading}
            onClick={(): void =>
              deleteListing.mutate(listingID, {
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
