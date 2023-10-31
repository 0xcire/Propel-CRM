import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUser } from '@/lib/react-query-auth';
import { useMarkListingAsSold } from '@/features/listings/hooks/useMarkListingAsSold';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { SelectInput, TextInput } from '@/components/form';
import { SubmitButton } from '@/components';

import { priceString } from '@/lib/validations/schema';
import { handleOnOpenChange } from '@/utils';
import { currency } from '@/utils/intl';

import type { UseFormReturn } from 'react-hook-form';

const markSoldSchema = z.object({
  salePrice: priceString,
  contactID: z.string().min(1),
});

type MarkSoldFields = z.infer<typeof markSoldSchema>;

const defaultValues = {
  salePrice: '',
  contactID: '',
};

type MarkSoldProps = {
  listingID: number;
  listingPrice: string;
  leads:
    | Array<{
        value: unknown;
        text: string;
      }>
    | undefined;
};

type MarkSoldFormProps = {
  onSubmit: (values: MarkSoldFields) => void;
  listingPrice: string;
  leads:
    | Array<{
        value: unknown;
        text: string;
      }>
    | undefined;
  form: UseFormReturn<
    {
      salePrice: string;
      contactID: string;
    },
    unknown,
    undefined
  >;
};

export function MarkSold({
  listingID,
  listingPrice,
  leads,
}: MarkSoldProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const user = useUser();
  const markSold = useMarkListingAsSold();

  const form = useForm<MarkSoldFields>({
    resolver: zodResolver(markSoldSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (values: MarkSoldFields): void => {
    markSold.mutate(
      {
        listingID: listingID,
        contactID: +values.contactID,
        salePrice: values.salePrice,
        userID: user.data?.id as number,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open): void => handleOnOpenChange(open, setOpen)}
    >
      <>
        <DialogTrigger asChild>
          <DropdownMenuItem
            className='cursor-pointer'
            onSelect={(e): void => e.preventDefault()}
          >
            Mark Sold
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Mark Sold</DialogTitle>
            <DialogDescription>
              {`Enter sale data for listing ${listingID.toString()}`}
            </DialogDescription>
          </DialogHeader>
          <MarkSoldForm
            leads={leads}
            listingPrice={listingPrice}
            onSubmit={onSubmit}
            form={form}
          />

          <DialogFooter>
            <Button
              variant='outline'
              onClick={(): void => setOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton
              isLoading={markSold.isLoading}
              form='mark-sold'
              disabled={!form.formState.isDirty}
            >
              Save Changes
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </>
    </Dialog>
  );
}

function MarkSoldForm({
  onSubmit,
  listingPrice,
  leads,
  form,
}: MarkSoldFormProps): JSX.Element {
  return (
    <>
      <Form {...form}>
        <form
          id='mark-sold'
          className='flex flex-col gap-2'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <TextInput
            name='salePrice'
            label='Sale Price'
            placeholder={`Listed at ${currency.format(+listingPrice)}`}
            control={form.control}
          />

          <SelectInput
            control={form.control}
            name='contactID'
            label='Contact'
            options={
              leads && leads[0]?.value !== null
                ? leads
                : [{ value: '0', text: 'No leads' }]
            }
            placeholder='Sold to'
          />
        </form>
      </Form>
    </>
  );
}
