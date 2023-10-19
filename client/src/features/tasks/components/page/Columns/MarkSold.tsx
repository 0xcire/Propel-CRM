import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SubmitButton } from '@/components';
// import { SelectInput } from '@/components/form';
import { TextInput } from '@/components/form';

import { priceString } from '@/lib/validations/schema';
import { handleOnOpenChange } from '@/utils';

import type { ContactInfo } from '@/features/listings/types';
import { useMarkListingAsSold } from '@/features/listings/hooks/useMarkListingAsSold';
import { currency } from '@/utils/intl';
import { useUser } from '@/lib/react-query-auth';

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
  leads: Array<ContactInfo> | undefined;
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
      <DialogTrigger
        onClick={(e): void => e.stopPropagation()}
        asChild
      >
        <p className='w-full cursor-pointer'>Mark Sold</p>
      </DialogTrigger>
      <DialogContent
        onClick={(e): void => e.stopPropagation()}
        className='sm:max-w-[425px]'
      >
        <DialogHeader>
          <DialogTitle>Mark Sold</DialogTitle>
          <DialogDescription>
            {`Make changes to listing ${listingID.toString()}`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='mark-sold'
            className=''
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <TextInput
              name='salePrice'
              label='Sale Price'
              placeholder={`listed at ${currency.format(+listingPrice)}`}
              control={form.control}
            />

            {/* TODO: UPDATE SELECTINPUT TO HANDLE OBJECTS */}
            <FormField
              control={form.control}
              name='contactID'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <Select
                    onValueChange={(val): void => field.onChange(val)}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Sold to' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leads && leads[0] && leads[0].id !== null ? (
                        leads?.map((lead) => (
                          <SelectItem
                            key={lead.name}
                            value={lead.id.toString()}
                          >
                            {lead.name}
                          </SelectItem>
                        ))
                      ) : (
                        <></>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

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
            text='Save changes'
            disabled={!form.formState.isDirty}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
