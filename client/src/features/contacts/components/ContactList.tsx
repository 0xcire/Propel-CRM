import { useContacts } from '../hooks/useContacts';
import { Contact } from './Contact';

export function ContactList(): JSX.Element {
  const contacts = useContacts();

  return (
    <div className='p-4'>
      {contacts.data?.contacts.map(({ name, email, phoneNumber, address }) => (
        <Contact
          key={name}
          name={name}
          email={email}
          phone={phoneNumber}
          address={address}
        />
      ))}
    </div>
  );
}
