import { memo } from 'react';
import { Link } from 'react-router-dom';

import { useDashboardContacts } from '../../hooks/useDashboardContacts';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Spinner } from '@/components/Spinner';
import { ListEmpty } from '@/components/ListEmpty';
import { Contact } from './Contact';

const MemoizedContact = memo(Contact);

export function DashboardContacts(): JSX.Element {
  const contacts = useDashboardContacts();

  if (contacts.isLoading) {
    return (
      <Spinner
        variant='md'
        fillContainer
      />
    );
  }

  if (contacts.data && !contacts.data[0]) {
    return <ListEmpty>No contacts to display.</ListEmpty>;
  }

  return (
    <ScrollArea className='h-full p-4 pt-0'>
      {contacts.data?.map((contact) => (
        <MemoizedContact
          key={`${contact.id}-${contact.name.split(' ')[0]}`}
          contact={contact}
        />
      ))}
      <div className='text-center'>
        <Link
          to='/contacts'
          className='mx-auto w-full text-slate-500'
        >
          View All
        </Link>
      </div>
    </ScrollArea>
  );
}
