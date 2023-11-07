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
  const searchContacts = useSearchContacts();
  const { setQuery } = useQuerySearchParams('name');

  const isSearching = !!searchParams.get('name');

  useEffect(() => {
    if (!searchParams.get('page') || !searchParams.get('limit')) {
      setSearchParams(
        [
          ['page', '1'],
          ['limit', '10'],
        ],
        {
          replace: true,
        }
      );
    }

    // eslint-disable-next-line
  }, []);

  {
    /* TODO: create reusable <DataTable /> component */
  }

  return (
    <ContactTable
      data={isSearching ? searchContacts.data ?? [] : contacts.data ?? []}
      isFetching={isSearching ? searchContacts.isFetching : contacts.isFetching}
      isLoading={isSearching ? searchContacts.isLoading : contacts.isLoading}
      columns={listingColumns}
      setQuery={setQuery}
    />
  );
}
