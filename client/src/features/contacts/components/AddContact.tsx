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
import { Button } from '@/components/ui/button';

export function AddContact({ text }: { text?: string }): JSX.Element {
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
      {text ? (
        <DialogTrigger asChild>
          <Button>
            <span className='flex items-center gap-2'>
              <UserPlus
                className='mt-[2px] cursor-pointer'
                size={18}
                tabIndex={0}
              />
              {text}
            </span>
          </Button>
        </DialogTrigger>
      ) : (
        <Tooltip content='Add new contact'>
          <DialogTrigger asChild>
            <UserPlus
              className='cursor-pointer'
              size={20}
              tabIndex={0}
            />
          </DialogTrigger>
        </Tooltip>
      )}

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
