import { useState } from 'react';

import { useRemoveLead } from '../hooks/useRemoveLead';

import { Trash2Icon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { SubmitButton } from '@/components';

import type { ContactInfo } from '../types';
import { Button } from '@/components/ui/button';

export function RemoveLead({
  contactInfo,
  listingID,
}: {
  listingID: number;
  contactInfo: ContactInfo;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const removeLead = useRemoveLead(listingID);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className='mr-auto flex items-center gap-1'>
        <Trash2Icon
          className='cursor-pointer pt-[2px]'
          size={16}
          tabIndex={0}
        />
        Remove
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will remove{' '}
            <span className='font-black'>{contactInfo.name} </span>
            from your lead list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={(): void => setOpen(false)}
            variant='outline'
          >
            Cancel
          </Button>

          <SubmitButton
            variant='destructive'
            isLoading={removeLead.isLoading}
            onClick={(): void => {
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
          >
            Remove
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
