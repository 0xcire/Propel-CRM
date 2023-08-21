import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateContact } from '../hooks/useUpdateContact';

import { name, mobilePhone, verifyPassword } from '@/config';

import { fieldsAreDirty, filterEqualFields } from '@/utils/form-data';

import { PencilIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { SubmitButton, Tooltip } from '@/components';

import type { NewContact, ContactAsProp } from '../types';
import { TextInput } from '@/components/form';

const ContactInfoSchema = z.object({
  name: name,
  email: z.string().email(),
  phoneNumber: mobilePhone,
  address: z.string().min(12).max(255),
  verifyPassword: verifyPassword,
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
    const passwordFilled = fieldsAreDirty<ContactInfoFields>(
      form,
      'verifyPassword'
    );
    const dataChanged = fieldsAreDirty<ContactInfoFields>(form, [
      'name',
      'email',
      'phoneNumber',
      'address',
    ]);

    return passwordFilled && dataChanged;
  };

  useEffect(() => {
    form.reset({ ...contact, verifyPassword: '' });
  }, [contact, form]);

  function onSubmit(values: ContactInfoFields): void {
    const data: Partial<NewContact> = filterEqualFields({
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
            <TextInput
              name='name'
              label='Name'
              control={form.control}
            />
            <TextInput
              name='email'
              label='Email'
              control={form.control}
            />
            <TextInput
              name='phoneNumber'
              label='Phone Number'
              control={form.control}
            />
            <TextInput
              name='address'
              label='Address'
              control={form.control}
            />
            <TextInput
              name='verifyPassword'
              label='Your Password'
              type='password'
              control={form.control}
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
