import { useContacts } from '../hooks/useContacts';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Spinner } from '@/components';

import { Contact } from './Contact';

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
      {contacts.data?.map((contact) => (
        <Contact
          key={contact.name}
          contact={contact}
        />
      ))}
    </ScrollArea>
  );
}
