import { useMemo, useState } from 'react';

import { useUpdateListing } from '../../hooks/useUpdateListing';

import { PencilIcon } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ListingForm } from '../ListingForm';

import { filterEqualFields, generateDefaultValues } from '@/utils/form-data';
import { transformData } from '../../utils';

import type { Listing, NewListing, ListingFields } from '../../types';

// [ ]: currently redundant w/ <ListingRoute /> can refactor when adding img upload

type UpdateListingProps = {
  listing: Listing;
};

export function UpdateListing({ listing }: UpdateListingProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const updateListing = useUpdateListing();

  const defaultValues = useMemo(
    () => generateDefaultValues(listing),
    [listing]
  );

  function onSubmit(values: ListingFields): void {
    const transformedData = transformData(values);

    const data: Partial<NewListing> = filterEqualFields({
      newData: transformedData,
      originalData: listing,
    });

    updateListing.mutate(
      { id: listing.id, data: data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Tooltip content='edit'>
          <PencilIcon
            data-testid='update-listing-svg'
            className='ml-auto cursor-pointer'
            size={18}
            tabIndex={0}
          />
        </Tooltip>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Listing</DialogTitle>
        </DialogHeader>

        <ListingForm
          isCreate={false}
          listingID={listing.id}
          isLoading={updateListing.isLoading}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
