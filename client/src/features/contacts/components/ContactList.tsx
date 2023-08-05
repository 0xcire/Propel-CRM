import { useContacts } from '../hooks/useContacts';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Spinner } from '@/components';

import { Contact } from './Contact';
import type { Contact as ContactData } from '../types';

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
