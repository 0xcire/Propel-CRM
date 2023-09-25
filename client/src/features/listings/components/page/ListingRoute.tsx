import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useUser } from '@/lib/react-query-auth';

import { useListing } from '../../hooks/useListing';

import { useUpdateListing } from '../../hooks/useUpdateListing';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ListingForm } from '../ListingForm';

import { Spinner } from '@/components';

import { filterEqualFields } from '@/utils/form-data';
import { generateDefaultValues, transformData } from '../../utils';

import type { Listing, NewListing, ListingFields } from '../../types';

// Currently just update form.
// when adding file uploads, can improve this.

export function ListingRoute(): JSX.Element {
  const [open, setOpen] = useState(false);

  const user = useUser();
  const updateListing = useUpdateListing();

  const { id } = useParams();
  const navigate = useNavigate();
  const listing = useListing(+(id as string));

  useEffect(() => {
    if (id) {
      setOpen(true);
    }

    // eslint-disable-next-line
  }, []);

  if (listing.isLoading) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open: boolean): void => {
          if (!open) {
            navigate(-1);
            setOpen(false);
          }
        }}
      >
        <DialogContent>
          <div className='grid h-full w-full place-items-center'>
            <Spinner
              className='mx-auto'
              variant='md'
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const listingData = listing.data && listing.data[0];

  const defaultValues = generateDefaultValues(listingData);

  function onSubmit(values: ListingFields): void {
    const transformedData = transformData(user.data?.id as number, values);

    const data: Partial<NewListing> = filterEqualFields({
      newData: transformedData,
      originalData: listingData as Listing,
    });

    updateListing.mutate(
      { id: listingData?.id as number, data: data },
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
      onOpenChange={(open: boolean): void => {
        if (!open) {
          navigate(-1);
          setOpen(false);
        }
      }}
    >
      <DialogContent>
        <div>
          <DialogHeader>
            <DialogTitle>Update Listing</DialogTitle>
          </DialogHeader>

          <ListingForm
            isCreate={false}
            listingID={listingData?.id}
            isLoading={updateListing.isLoading}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
