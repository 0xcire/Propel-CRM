import { ScrollArea } from '@/components/ui/scroll-area';
import { useContacts } from '../hooks/useContacts';
import { Contact } from './Contact';
import { Spinner } from '@/components';

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
      {contacts.data?.contacts.map(({ name, email, phoneNumber, address }) => (
        <Contact
          key={name}
          name={name}
          email={email}
          phone={phoneNumber}
          address={address}
        />
      ))}
    </ScrollArea>
  );
}
