import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { TextInput } from '@/components/form';
import { SubmitButton } from '@/components';

import { contactSchema } from '@/lib/validations/contacts';

import type { Dispatch, SetStateAction } from 'react';
import type { DeepPartial } from 'react-hook-form';
import type { FormMode } from '@/types';

interface ContactFormProps extends FormMode {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: UpdateContactFields | CreateContactFields) => void;
  defaultValues: DeepPartial<UpdateContactFields | CreateContactFields>;
}

export type UpdateContactFields = z.infer<typeof contactSchema>;
export type CreateContactFields = z.infer<typeof contactSchema>;

export function ContactForm({
  isLoading,
  isCreate,
  setOpen,
  onSubmit,
  defaultValues,
}: ContactFormProps): JSX.Element {
  const form = useForm<UpdateContactFields | CreateContactFields>({
    resolver: isCreate
      ? zodResolver(contactSchema)
      : zodResolver(contactSchema),
    defaultValues: defaultValues,
  });

  const formComplete = Object.keys(form.formState.dirtyFields).length === 4;

  useEffect(() => {
    form.reset();
  }, [form]);

  return (
    <>
      <Form {...form}>
        <form
          id={isCreate ? 'add-contact' : 'update-contact'}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <TextInput
            name='name'
            placeholder='John Doe'
            control={form.control}
          />
          <TextInput
            name='email'
            placeholder='email@email.com'
            control={form.control}
          />
          <TextInput
            name='phoneNumber'
            placeholder='555-555-5555'
            control={form.control}
          />
          <TextInput
            name='address'
            placeholder='123 Name St. Seattle, WA 01234'
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
          disabled={isCreate ? !formComplete : !form.formState.isDirty}
          form={isCreate ? 'add-contact' : 'update-contact'}
          isLoading={isLoading}
          text='Update'
        />
      </DialogFooter>
    </>
  );
}
