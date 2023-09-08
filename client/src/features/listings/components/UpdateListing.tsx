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

import { ListingForm, ListingHTMLFormInputs } from './ListingForm';

import type { Listing } from '../types';
import { filterEqualFields } from '@/utils/form-data';

export function UpdateListing({ listing }: { listing: Listing }): JSX.Element {
  const [open, setOpen] = useState(false);
  const updateListing = useUpdateListing();

  const defaultValues = {
    address: listing.address,
    description: listing.description,
    propertyType: listing.propertyType,
    price: listing.price,
    bedrooms: listing.bedrooms.toString(),
    baths: listing.baths.toString(),
    squareFeet: listing.squareFeet.toString(),
  };

  function onSubmit(values: ListingHTMLFormInputs): void {
    const data: Partial<ListingHTMLFormInputs> = filterEqualFields({
      newData: values,
      originalData: listing,
    });

    updateListing.mutate(
      { id: listing.id as number, data: data },
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
