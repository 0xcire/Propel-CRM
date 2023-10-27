import { useState } from 'react';

import { useUpdateContact } from '../hooks/useUpdateContact';

import { PencilIcon } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Tooltip } from '@/components';
import { ContactForm } from './ContactForm';

import { handleOnOpenChange } from '@/utils';
import { filterEqualFields } from '@/utils/form-data';

import type { DeepPartial } from 'react-hook-form';
import type { UpdateContactFields } from './ContactForm';
import type { ContactAsProp, NewContact } from '../types';

interface UpdateContactProps extends ContactAsProp {
  asDropdownMenuItem?: boolean;
}

export function UpdateContact({
  contact,

  asDropdownMenuItem,
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
      onOpenChange={(open): void => handleOnOpenChange(open, setOpen)}
    >
      {asDropdownMenuItem ? (
        <DialogTrigger asChild>
          <DropdownMenuItem
            className='cursor-pointer'
            onSelect={(e): void => e.preventDefault()}
          >
            Update
          </DropdownMenuItem>
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
