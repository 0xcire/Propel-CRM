import { Tooltip } from '@/components';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { type ListingFields, ListingForm } from './ListingForm';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateListing } from '../hooks/useCreateListing';
import { useUser } from '@/lib/react-query-auth';
import { useState } from 'react';

export function AddListing(): JSX.Element {
  const [open, setOpen] = useState(false);
  // TODO: replace useUser with custom hook, context, or etc
  const user = useUser();
  const createListing = useCreateListing();

  const onSubmit = (values: ListingFields): void => {
    console.log(values);

    const data = {
      ...values,
      userID: user.data?.id as number,
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
            squareFeet: 0,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
