import { useContacts } from '../hooks/useContacts';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Spinner } from '@/components';

import { Contact } from './Contact';
import type { Contact as ContactData } from '../types';
import { Typography } from '@/components/ui/typography';

// TODO: potential performance optimization: when updating contact, render just that contact,
// not re render entire list

export function ContactList(): JSX.Element {
  const contacts = useContacts();

  if (contacts.isLoading) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
    );
  }

  if (contacts.data && !contacts.data[0]) {
    return (
      <Typography
        className='px-4 text-slate-500'
        variant='p'
      >
        No contacts to display.
      </Typography>
    );
  }

  return (
    <ScrollArea className='h-full p-4 pt-0'>
      {contacts.data?.map((contact: ContactData) => (
        <Contact
          key={`${contact.id}-${contact.name.split(' ')[0]}`}
          contact={contact}
        />
      ))}
    </ScrollArea>
  );
}
