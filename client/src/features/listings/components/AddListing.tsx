import { useState } from 'react';

import { useUser } from '@/lib/react-query-auth';
import { useCreateListing } from '../hooks/useCreateListing';

import { PlusIcon } from 'lucide-react';
import { Tooltip } from '@/components';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ListingForm } from './ListingForm';

import type { ListingFields } from './ListingForm';
import type { NewListing } from '../types';

export function AddListing(): JSX.Element {
  const [open, setOpen] = useState(false);

  const user = useUser();
  const createListing = useCreateListing();

  const onSubmit = (values: ListingFields): void => {
    const data: NewListing = {
      userID: user.data?.id as number,
      address: values.address,
      description: values.description,
      propertyType: values.propertyType,
      price: values.price,
      bedrooms: +values.bedrooms,
      baths: +values.baths,
      squareFeet: +values.squareFeet,
    };

    createListing.mutate(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Tooltip content='Add listing'>
        <DialogTrigger asChild>
          <PlusIcon
            className='cursor-pointer'
            size={18}
          />
        </DialogTrigger>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Listing</DialogTitle>
        </DialogHeader>
        <ListingForm
          isCreate={true}
          isLoading={createListing.isLoading}
          onSubmit={onSubmit}
          defaultValues={{
            address: '',
            description: '',
            propertyType: undefined,
            price: '',
            bedrooms: undefined,
            baths: undefined,
            squareFeet: undefined,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
