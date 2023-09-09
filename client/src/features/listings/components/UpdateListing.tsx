import { useState } from 'react';

import { useUser } from '@/lib/react-query-auth';

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

import { ListingFields, ListingForm } from './ListingForm';

import { filterEqualFields } from '@/utils/form-data';

import type { Listing, NewListing } from '../types';

export function UpdateListing({ listing }: { listing: Listing }): JSX.Element {
  const [open, setOpen] = useState(false);
  const user = useUser();
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

  function onSubmit(values: ListingFields): void {
    const transformedData: NewListing = {
      userID: user.data?.id as number,
      address: values.address,
      description: values.description,
      propertyType: values.propertyType,
      price: values.price,
      bedrooms: +values.bedrooms,
      baths: +values.baths,
      squareFeet: +values.squareFeet,
    };

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
