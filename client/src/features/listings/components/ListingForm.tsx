import { type DeepPartial, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { SelectInput, TextAreaInput, TextInput } from '@/components/form';

import { listingSchema } from '@/lib/validations/listings';
import type { FormMode } from '@/types';
import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { SubmitButton } from '@/components';
import { Button } from '@/components/ui/button';

interface ListingFormProps extends FormMode {
  defaultValues: DeepPartial<ListingFields>;
  onSubmit: (values: ListingFields) => void;
}

export type ListingFields = z.infer<typeof listingSchema>;

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
  defaultValues,
  onSubmit,
}: ListingFormProps): JSX.Element {
  const form = useForm<ListingFields>({
    resolver: zodResolver(listingSchema),
    defaultValues: defaultValues,
  });
  return (
    <>
      <Form {...form}>
        <form
          id={isCreate ? 'add-listing' : 'update-listing'}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <TextInput
            name='address'
            label='Address'
            control={form.control}
          />
          <TextAreaInput
            name='description'
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
              control={form.control}
            />
            <div className='flex items-center gap-2'>
              <SelectInput<ListingFields, Rooms, typeof rooms>
                name='bedrooms'
                options={rooms}
                placeholder='Bedrooms'
                control={form.control}
              />
              <SelectInput<ListingFields, Rooms, typeof rooms>
                name='baths'
                options={rooms}
                placeholder='Baths'
                control={form.control}
              />
            </div>
          </div>
        </form>
      </Form>

      <DialogFooter>
        {/* {!isCreate && <DeleteTask id={task?.id as number} />} */}
        <DialogTrigger asChild>
          <Button variant='outline'>Close</Button>
        </DialogTrigger>
        <SubmitButton
          //   disabled={isCreate ? titleIsEmpty : !form.formState.isDirty}
          form={isCreate ? 'add-listing' : 'update-listing'}
          isLoading={isLoading}
          text='Add'
        />
      </DialogFooter>
    </>
  );
}