import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DeleteListing } from './DeleteListing';

import { Button } from '@/components/ui/button';
import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { SelectInput, TextAreaInput, TextInput } from '@/components/form';
import { SubmitButton } from '@/components';

import { listingSchema } from '@/lib/validations/listings';

import type { DeepPartial } from 'react-hook-form';
import type { ListingFields } from '../types';
import type { FormMode } from '@/types';

interface ListingFormProps extends FormMode {
  defaultValues: DeepPartial<ListingFields>;
  onSubmit: (values: ListingFields) => void;
  listingID?: number;
}

// TODO: propertyType
// single family, apartment, townhome, condo, duplex, etc..

const propertyTypes = [
  'single family',
  'apartment',
  'townhome',
  'condo',
  'duplex',
] as const;
type PropertyTypes = (typeof propertyTypes)[number];

const rooms = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
] as const;
type Rooms = (typeof rooms)[number];

export function ListingForm({
  isCreate,
  isLoading,
  listingID,
  defaultValues,
  onSubmit,
}: ListingFormProps): JSX.Element {
  const form = useForm<ListingFields>({
    resolver: zodResolver(listingSchema),
    defaultValues: defaultValues,
  });

  return (
    <div className='flex h-[80vh] flex-col'>
      <Form {...form}>
        <form
          id={isCreate ? 'add-listing' : 'update-listing'}
          className='my-4 flex flex-1 flex-col gap-2'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <TextInput
            name='address'
            label='Address'
            control={form.control}
          />
          <TextAreaInput
            name='description'
            className='flex-1'
            label='Description'
            control={form.control}
          />

          <div className='flex items-center gap-2'>
            <TextInput
              name='price'
              label='Price'
              type='number'
              control={form.control}
            />
            <TextInput
              name='squareFeet'
              label='Square Feet'
              type='number'
              control={form.control}
            />
          </div>

          <div className='flex items-center justify-between pt-2'>
            <SelectInput<ListingFields, PropertyTypes, typeof propertyTypes>
              name='propertyType'
              options={propertyTypes}
              placeholder='Property Type'
              label='Property Type'
              control={form.control}
            />
            <div className='flex items-center gap-4'>
              <SelectInput<ListingFields, Rooms, typeof rooms>
                name='bedrooms'
                options={rooms}
                label='Bedrooms'
                placeholder='Bedrooms'
                control={form.control}
              />
              <SelectInput<ListingFields, Rooms, typeof rooms>
                name='baths'
                options={rooms}
                label='Baths'
                placeholder='Baths'
                control={form.control}
              />
            </div>
          </div>
        </form>
      </Form>

      <DialogFooter>
        {!isCreate && listingID && <DeleteListing listingID={listingID} />}
        <DialogTrigger asChild>
          <Button variant='outline'>Close</Button>
        </DialogTrigger>
        <SubmitButton
          disabled={!form.formState.isDirty}
          form={isCreate ? 'add-listing' : 'update-listing'}
          isLoading={isLoading}
          text={isCreate ? 'Add' : 'Save'}
        />
      </DialogFooter>
    </div>
  );
}
