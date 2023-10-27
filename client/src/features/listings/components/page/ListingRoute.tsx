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

import { NestedNotFound } from '@/components/Layout/page/NestedNotFound';

import { ListingForm } from '../ListingForm';

import { Spinner } from '@/components';

import { filterEqualFields, generateDefaultValues } from '@/utils/form-data';
import { transformData } from '../../utils';

import type { NewListing, ListingFields } from '../../types';

// TODO: Currently just update form.
// when adding file uploads, can improve this
// then add <UpdateListing listing={row.original} /> to ListingColumns

export function ListingRoute(): JSX.Element {
  const [routeOpen, setRouteOpen] = useState(true);

  const user = useUser();
  const updateListing = useUpdateListing();

  const { id } = useParams();
  const navigate = useNavigate();
  const listing = useListing(+(id as string));

  useEffect(() => {
    if (id) {
      setRouteOpen(true);
    }

    // eslint-disable-next-line
  }, []);

  if (listing.isLoading) {
    return (
      <Dialog
        open={routeOpen}
        onOpenChange={(open: boolean): void => {
          if (!open) {
            navigate(-1);
            setRouteOpen(false);
          }
        }}
      >
        <DialogContent className='h-[80vh]'>
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

  if (!listing.data || !listing.data[0]) {
    return <NestedNotFound context='listing' />;
  }

  const listingData = listing.data[0];

  const defaultValues = generateDefaultValues(listingData);

  function onSubmit(values: ListingFields): void {
    const transformedData = transformData(user.data?.id as number, values);

    const data: Partial<NewListing> = filterEqualFields({
      newData: transformedData,
      originalData: listingData,
    });

    updateListing.mutate(
      { id: listingData.id as number, data: data },
      {
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  }

  return (
    <Dialog
      open={routeOpen}
      onOpenChange={(open: boolean): void => {
        if (!open) {
          navigate(-1);
          setRouteOpen(false);
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
