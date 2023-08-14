import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateContact } from '../hooks/useCreateContact';

import { name, mobilePhone } from '@/config';

import { UserPlus } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Tooltip } from '@/components/Tooltip';
import { SubmitButton } from '@/components';
import { Button } from '@/components/ui/button';

const AddContactSchema = z.object({
  name: name,
  email: z.string().email(),
  phoneNumber: mobilePhone,
  // TODO: basic validation for now. will have autocomplete from mapbox in future
  address: z.string().min(12).max(255),
});
type AddContactFields = z.infer<typeof AddContactSchema>;

export function AddContact(): JSX.Element {
  const [open, setOpen] = useState(false);

  const createContact = useCreateContact();

  const form = useForm<AddContactFields>({
    resolver: zodResolver(AddContactSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
    },
  });

  const formComplete = Object.keys(form.formState.dirtyFields).length === 4;

  function onSubmit(values: AddContactFields): void {
    createContact.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
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
        <Form {...form}>
          <form
            id='add-contact'
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
                  <FormLabel>Phone</FormLabel>
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
          </form>
        </Form>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant='outline'>Close</Button>
          </DialogTrigger>
          <SubmitButton
            disabled={!formComplete}
            form='add-contact'
            isLoading={createContact.isLoading}
            text='Save'
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
