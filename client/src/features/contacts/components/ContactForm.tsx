import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { type DeepPartial, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { TextInput } from '@/components/form';
import { SubmitButton } from '@/components';

import { contactSchema } from '@/lib/validations/contacts';

import type { FormMode } from '@/types';

import { fieldsAreDirty } from '@/utils/form-data';

interface ContactFormProps extends FormMode {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: UpdateContactFields | CreateContact) => void;
  defaultValues: DeepPartial<UpdateContactFields | CreateContact>;
}

const createContactSchema = contactSchema.omit({
  verifyPassword: true,
});

export type UpdateContactFields = z.infer<typeof contactSchema>;
export type CreateContactFields = z.infer<typeof createContactSchema>;
export type CreateContact = {
  verifyPassword: never;
} & CreateContactFields;

export function ContactForm({
  isLoading,
  isCreate,
  setOpen,
  onSubmit,
  defaultValues,
}: ContactFormProps): JSX.Element {
  const form = useForm<UpdateContactFields | CreateContact>({
    resolver: isCreate
      ? zodResolver(createContactSchema)
      : zodResolver(contactSchema),
    defaultValues: defaultValues,
  });

  const formComplete = Object.keys(form.formState.dirtyFields).length === 4;

  const userHasChangedInfo = (): boolean => {
    const passwordFilled = fieldsAreDirty<UpdateContactFields>(
      form,
      'verifyPassword'
    );
    const dataChanged = fieldsAreDirty<UpdateContactFields>(form, [
      'name',
      'email',
      'phoneNumber',
      'address',
    ]);

    return passwordFilled && dataChanged;
  };

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
        {!isCreate && (
          <TextInput
            name='verifyPassword'
            label='Your Password'
            type='password'
            control={form.control}
          />
        )}
      </Form>
      <DialogFooter>
        <Button
          variant='outline'
          onClick={(): void => setOpen(false)}
        >
          Cancel
        </Button>
        <SubmitButton
          disabled={isCreate ? !formComplete : !userHasChangedInfo()}
          form={isCreate ? 'add-contact' : 'update-contact'}
          isLoading={isLoading}
          text='Update'
        />
      </DialogFooter>
    </>
  );
}
