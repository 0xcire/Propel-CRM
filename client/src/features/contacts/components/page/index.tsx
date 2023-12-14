import { useSearchParams } from 'react-router-dom';

import { useDebouncedQuerySearchParams } from '@/hooks/useDebouncedQuerySearchParams';
import { useDefaultSearchParams } from '@/hooks/useDefaultSearchParams';

import { useContacts } from '../../hooks/useContacts';
import { useSearchContacts } from '../../hooks/useSearchContacts';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';

import { ContactTable } from './ContactsTable';
import { listingColumns } from '../../config/ContactColumns';

import type { DefaultParams } from '@/types';

const defaultParams: DefaultParams = [
  { name: 'page', value: '1' },
  { name: 'limit', value: '10' },
];

export function ContactPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { setQuery } = useDebouncedQuerySearchParams('name');
  useDefaultSearchParams(defaultParams);
  useIdleTimeout();

  const contacts = useContacts();
  const searchContacts = useSearchContacts({ addLead: false });

  const isSearching = !!searchParams.get('name');

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
