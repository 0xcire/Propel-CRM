import { useState } from 'react';

import { useUpdateContact } from '../hooks/useUpdateContact';

import { PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Tooltip } from '@/components';
import { ContactForm } from './ContactForm';

import { filterEqualFields } from '@/utils/form-data';

import type { DeepPartial } from 'react-hook-form';
import type { UpdateContactFields } from './ContactForm';
import type { ContactAsProp, NewContact } from '../types';

interface UpdateContactProps extends ContactAsProp {
  text?: string;
  asButton?: boolean;
}

export function UpdateContact({
  contact,
  text,
  asButton,
}: UpdateContactProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const updateContact = useUpdateContact();

  const defaultValues: DeepPartial<UpdateContactFields> = {
    name: contact.name,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    address: contact.address,
  };

  function onSubmit(values: UpdateContactFields): void {
    const data: Partial<NewContact> = filterEqualFields({
      newData: values,
      originalData: contact,
    });

    updateContact.mutate(
      { id: contact.id, data: data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      // onOpenChange={(open): void => (open ? setOpen(true) : setOpen(false))}
    >
      {/* TODO: cleanup */}
      {text && asButton ? (
        <DialogTrigger
          onClick={(e): void => e.stopPropagation()}
          asChild
        >
          <Button>{text}</Button>
        </DialogTrigger>
      ) : text && !asButton ? (
        <DialogTrigger asChild>
          <p
            onClick={(e): void => {
              e.stopPropagation();
            }}
            className='h-full w-full cursor-pointer'
          >
            {text}
          </p>
        </DialogTrigger>
      ) : (
        <Tooltip content='edit'>
          <DialogTrigger asChild>
            <PencilIcon
              className='cursor-pointer'
              size={18}
              tabIndex={0}
            />
          </DialogTrigger>
        </Tooltip>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Contact</DialogTitle>
        </DialogHeader>

        <ContactForm
          isCreate={false}
          setOpen={setOpen}
          isLoading={updateContact.isLoading}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
