import { memo } from 'react';

import { useDashboardContacts } from '../../hooks/useDashboardContacts';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Spinner } from '@/components';

import { Contact } from '../Contact';
import { Typography } from '@/components/ui/typography';
import { Link } from 'react-router-dom';

const MemoizedContact = memo(Contact);

export function DashboardContacts(): JSX.Element {
  const contacts = useDashboardContacts();

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
