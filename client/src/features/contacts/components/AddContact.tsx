import { useState } from 'react';

import { useCreateContact } from '../hooks/useCreateContact';

import { UserPlus } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ContactForm } from './ContactForm';

import type { DeepPartial } from 'react-hook-form';
import type { CreateContactFields } from './ContactForm';

export function AddContact(): JSX.Element {
  const [open, setOpen] = useState(false);

  const createContact = useCreateContact();

  const defaultValues: DeepPartial<CreateContactFields> = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  };

  function onSubmit(values: CreateContactFields): void {
    createContact.mutate(values, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Tooltip content='Add new contact'>
        <DialogTrigger asChild>
          <UserPlus
            className='cursor-pointer'
            size={20}
            tabIndex={0}
          />
        </DialogTrigger>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>
        <ContactForm
          isCreate={true}
          setOpen={setOpen}
          isLoading={createContact.isLoading}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
