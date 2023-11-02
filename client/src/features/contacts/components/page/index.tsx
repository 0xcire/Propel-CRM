import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuerySearchParams } from '@/hooks';

import { useContacts } from '../../hooks/useContacts';
import { useSearchContacts } from '../../hooks/useSearchContacts';

import { ContactTable } from './ContactsTable';
import { listingColumns } from '../../config/ContactColumns';

export function ContactPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const contacts = useContacts();
  const queriedContacts = useSearchContacts();
  const { setQuery } = useQuerySearchParams('name');

  const isSearching = !!searchParams.get('name');

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams([['page', '1']], {
        replace: true,
      });
    }

    // eslint-disable-next-line
  }, []);

  {
    /* TODO: create reusable <DataTable /> component */
  }

  return (
    <ContactTable
      data={isSearching ? queriedContacts.data ?? [] : contacts.data ?? []}
      isFetching={
        isSearching ? queriedContacts.isFetching : contacts.isFetching
      }
      isLoading={isSearching ? queriedContacts.isLoading : contacts.isLoading}
      columns={listingColumns}
      setQuery={setQuery}
    />
  );
}
