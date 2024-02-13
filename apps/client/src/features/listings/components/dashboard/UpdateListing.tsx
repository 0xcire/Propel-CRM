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

export function UpdateListing({ listing }: { listing: Listing }): JSX.Element {
  const [open, setOpen] = useState(false);
  const updateListing = useUpdateListing();
  console.log('hey');

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
    console.log(transformData, listing);
    console.log(data);

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
      <Tooltip content='edit'>
        <DialogTrigger asChild>
          <PencilIcon
            data-testid='update-listing-svg'
            className='ml-auto cursor-pointer'
            size={18}
            tabIndex={0}
          />
        </DialogTrigger>
      </Tooltip>
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
