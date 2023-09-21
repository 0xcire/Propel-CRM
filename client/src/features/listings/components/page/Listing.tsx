import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/lib/react-query-auth';

import { useUpdateListing } from '../../hooks/useUpdateListing';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ListingForm } from '../ListingForm';

import { filterEqualFields } from '@/utils/form-data';

import type { Listing, ListingResponse, NewListing } from '../../types';
import type { ListingFields } from '../ListingForm';

// Currently just update form.
// when adding file uploads, can improve this.

export function Listing(): JSX.Element {
  const [open, setOpen] = useState(false);

  const user = useUser();
  const updateListing = useUpdateListing();

  const queryClient = useQueryClient();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const previousQueryParams = location.state.query;

  const page = previousQueryParams.get('page');
  const status = previousQueryParams.get('status');

  const listing = queryClient
    .getQueryData<ListingResponse>(['listings', { page: page, status: status }])
    ?.listings.find((listing) => listing.id === +(id as string));

  useEffect(() => {
    if (id) {
      setOpen(true);
    }
  }, []);

  const defaultValues = {
    address: listing?.address,
    description: listing?.description,
    propertyType: listing?.propertyType,
    price: listing?.price,
    bedrooms: listing?.bedrooms.toString(),
    baths: listing?.baths.toString(),
    squareFeet: listing?.squareFeet.toString(),
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
      originalData: listing as Listing,
    });

    updateListing.mutate(
      { id: listing?.id as number, data: data },
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
      <DialogContent id='contents'>
        <div id='actual-contents'>
          <DialogHeader>
            <DialogTitle>Update Listing</DialogTitle>
          </DialogHeader>

          <ListingForm
            isCreate={false}
            listingID={listing?.id}
            isLoading={updateListing.isLoading}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
