import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebounce, useNameQuerySearchParams } from '@/hooks';

import { useContacts } from '../../hooks/useContacts';
import { useSearchContacts } from '../../hooks/useSearchContacts';

import { ContactTable } from './ContactsTable';
import { listingColumns } from '../../config/ContactColumns';

import type { Contacts } from '../../types';

export function ContactPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  // not great. consider context.
  const [nameQuery, setNameQuery] = useState<string | undefined>(undefined);
  const debouncedNameQuery = useDebounce(nameQuery, 200);

  const contacts = useContacts();

  const queriedContacts = useSearchContacts();

  const isSearching = !!searchParams.get('name');

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams([['page', '1']], {
        replace: true,
      });
    }

    // eslint-disable-next-line
  }, []);

  useNameQuerySearchParams(debouncedNameQuery);

  {
    /* TODO: opportunity for <PageLayout /> */
  }
  {
    /* TODO: create reusable <DataTable /> component */
  }
  {
    /* TODO: handle undefined or [] data */
  }

  return (
    <ContactTable
      data={
        isSearching
          ? (queriedContacts.data as Contacts)
          : (contacts.data as Contacts)
      }
      isFetching={
        isSearching ? queriedContacts.isFetching : contacts.isFetching
      }
      isLoading={isSearching ? queriedContacts.isLoading : contacts.isLoading}
      columns={listingColumns}
      nameQuery={nameQuery}
      setNameQuery={setNameQuery}
    />
  );
}
