import { useState } from 'react';
import { Listing } from '../types';
import { useUpdateListing } from '../hooks/useUpdateListing';
import { ListingFields, ListingForm } from './ListingForm';
// import { DeepPartial } from 'react-hook-form';
import { filterEqualFields } from '@/utils/form-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip } from '@/components';
import { PencilIcon } from 'lucide-react';

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
          <DialogTitle>Update Contact</DialogTitle>
        </DialogHeader>

        <ListingForm
          isCreate={false}
          //   setOpen={setOpen}
          isLoading={updateListing.isLoading}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
