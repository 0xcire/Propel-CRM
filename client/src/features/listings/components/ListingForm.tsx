import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { SelectInput, TextAreaInput, TextInput } from '@/components/form';
import { SubmitButton } from '@/components';

import { listingSchema } from '@/lib/validations/listings';
import {
  propertyTypeSelectOptions,
  roomsSelectOptions,
} from '@/config/listings';

import type { DeepPartial } from 'react-hook-form';
import type { ListingFields } from '../types';
import type { FormMode } from '@/types';

interface ListingFormProps extends FormMode {
  defaultValues: DeepPartial<ListingFields>;
  onSubmit: (values: ListingFields) => void;
  listingID?: number;
}

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
            <SelectInput
              name='propertyType'
              options={propertyTypeSelectOptions}
              placeholder='Property Type'
              label='Property Type'
              control={form.control}
            />
            <div className='flex items-center gap-4'>
              <SelectInput
                name='bedrooms'
                options={roomsSelectOptions}
                label='Bedrooms'
                placeholder='Bedrooms'
                control={form.control}
              />
              <SelectInput
                name='baths'
                options={roomsSelectOptions}
                label='Baths'
                placeholder='Baths'
                control={form.control}
              />
            </div>
          </div>
        </form>
      </Form>

      <DialogFooter>
        <DialogTrigger asChild>
          <Button variant='outline'>Close</Button>
        </DialogTrigger>
        <SubmitButton
          disabled={!form.formState.isDirty}
          form={isCreate ? 'add-listing' : 'update-listing'}
          isLoading={isLoading}
        >
          {isCreate ? 'Add' : 'Save'}
        </SubmitButton>
      </DialogFooter>
    </div>
  );
}
