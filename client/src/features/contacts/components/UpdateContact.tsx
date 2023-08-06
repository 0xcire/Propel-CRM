import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateContact } from '../hooks/useUpdateContact';

import { filterFields } from '@/utils/form-data';

import { PencilIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { SubmitButton, Tooltip } from '@/components';

import type { NewContact, ContactAsProp } from '../types';

const ContactInfoSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  address: z.string(),
  verifyPassword: z.string(),
});
type ContactInfoFields = z.infer<typeof ContactInfoSchema>;

export function UpdateContact({ contact }: ContactAsProp): JSX.Element {
  const [open, setOpen] = useState(false);
  const updateContact = useUpdateContact();

  const form = useForm<ContactInfoFields>({
    resolver: zodResolver(ContactInfoSchema),
    defaultValues: {
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      address: contact.address,
      verifyPassword: '',
    },
  });

  const userHasChangedInfo = (): boolean => {
    const dirtyFields = Object.keys(form.formState.dirtyFields);
    const fields = ['name', 'email', 'phoneNumber', 'address'];
    const passwordFilled = dirtyFields.includes('verifyPassword');
    const dataChanged = dirtyFields.some((field) => fields.includes(field));

    return passwordFilled && dataChanged;
  };

  useEffect(() => {
    form.reset({ ...contact, verifyPassword: '' });
  }, [contact, form]);

  function onSubmit(values: ContactInfoFields): void {
    const data: Partial<NewContact> = filterFields({
      newData: values,
      originalData: contact,
    });
    updateContact.mutate(
      { id: contact.id, data: data },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Tooltip content='edit'>
        <DialogTrigger asChild>
          <PencilIcon
            className='cursor-pointer'
            size={18}
            tabIndex={0}
          />
        </DialogTrigger>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Contact</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id='update-contact'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-8'>
                      <Input {...field} />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-8'>
                      <Input {...field} />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-8'>
                      <Input {...field} />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-8'>
                      <Input {...field} />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='verifyPassword'
              render={({ field }): JSX.Element => (
                <FormItem>
                  <FormLabel>Your Password</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-8'>
                      <Input
                        type='password'
                        {...field}
                      />
                    </div>
                  </FormControl>

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
            disabled={!userHasChangedInfo()}
            form='update-contact'
            isLoading={updateContact.isLoading}
            text='Update'
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
