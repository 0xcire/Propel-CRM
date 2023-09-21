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
import { generateDefaultValues, transformData } from '../../utils';

import type {
  Listing,
  ListingResponse,
  NewListing,
  ListingFields,
} from '../../types';

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

    // eslint-disable-next-line
  }, []);

  const defaultValues = generateDefaultValues(listing);

  function onSubmit(values: ListingFields): void {
    const transformedData = transformData(user.data?.id as number, values);

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
      <DialogContent>
        <div>
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
