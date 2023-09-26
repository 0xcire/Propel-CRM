import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebounce } from '@/hooks';

import { useContacts } from '../../hooks/useContacts';
import { useSearchContacts } from '../../hooks/useSearchContacts';

import { ContactTable } from './ContactsTable';
import { listingColumns } from '../../config/ContactColumns';

import { PageHeader } from '@/components/Layout/PageHeader';
import { AddContact } from '../AddContact';

import type { Contacts } from '../../types';

export function ContactPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  // not great. consider context.
  const [nameQuery, setNameQuery] = useState<string | undefined>(undefined);
  const debouncedNameQuery = useDebounce(nameQuery, 200);

  const contacts = useContacts();

  const queriedContacts = useSearchContacts();

  const isSearching = !!debouncedNameQuery && !!nameQuery;

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams([['page', '1']], {
        replace: true,
      });
    }

    // eslint-disable-next-line
  }, []);

  // TODO: extract into custom hook
  useEffect(() => {
    if (debouncedNameQuery === '' && searchParams.get('name')) {
      searchParams.delete('name');
      setSearchParams(searchParams);
    }

    if (debouncedNameQuery) {
      searchParams.set('name', debouncedNameQuery);
      setSearchParams(searchParams);
    }

    // eslint-disable-next-line
  }, [debouncedNameQuery]);
  return (
    <>
      {/* TODO: opportunity for <PageLayout /> */}
      <div className='flex h-full w-full flex-1 flex-col p-10'>
        <PageHeader text='All Contacts'>
          <AddContact text='Add Contact' />
        </PageHeader>
        <div className='h-full pt-10'>
          <div className='relative flex h-full flex-col rounded-md border shadow-md'>
            <div className='absolute flex h-full w-full flex-col px-4'>
              {/* TODO: create reusable <DataTable /> component */}
              {/* TODO: handle undefined or [] data */}
              <ContactTable
                // data={contacts.data as Contacts}
                data={
                  isSearching
                    ? (queriedContacts.data as Contacts)
                    : (contacts.data as Contacts)
                }
                isFetching={
                  isSearching ? queriedContacts.isFetching : contacts.isFetching
                }
                isLoading={
                  isSearching ? queriedContacts.isLoading : contacts.isLoading
                }
                columns={listingColumns}
                nameQuery={nameQuery}
                setNameQuery={setNameQuery}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
