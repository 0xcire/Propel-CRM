import { useState } from 'react';

import { useUpdateListing } from '../hooks/useUpdateListing';

import { PencilIcon } from 'lucide-react';
import { Tooltip } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { type ListingFields, ListingForm } from './ListingForm';

import { filterEqualFields } from '@/utils/form-data';

import type { Listing } from '../types';

export function UpdateListing({ listing }: { listing: Listing }): JSX.Element {
  const [open, setOpen] = useState(false);
  const updateListing = useUpdateListing();

  console.log(listing);

  const defaultValues = {
    address: listing.address,
    description: listing.description,
    propertyType: listing.propertyType,
    price: listing.price,
    bedrooms: listing.bedrooms,
    baths: listing.baths,
    squareFeet: listing.squareFeet,
  };

  function onSubmit(values: ListingFields): void {
    const data: Partial<ListingFields> = filterEqualFields({
      newData: values,
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
      <Tooltip content='edit'>
        <DialogTrigger asChild>
          <PencilIcon
            className='cursor-pointer'
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
