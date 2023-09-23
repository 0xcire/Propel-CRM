import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSearchContacts } from '@/features/contacts/hooks/useSearchContacts';
import { useAddLead } from '../../hooks/useAddLead';

import { useDebounce } from '@/hooks/useDebounce';

import { PlusIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

import { SubmitButton } from '@/components';

import type { ComponentProps } from 'react';

// ?
import type { Contact } from '@/features/contacts/types';

interface AddLeadProps extends ComponentProps<'div'> {
  listingID: number;
}

// TODO: revisit when building tasks page
// could make generic: 'ContactSearch' or etc..
export function AddLead({ listingID, ...props }: AddLeadProps): JSX.Element {
  const [query, setQuery] = useState<string | undefined>(undefined);

  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedQuery = useDebounce(query, 200);

  // TODO: consider extracting into shared dir. revisit when building tasks page
  const searchContacts = useSearchContacts();

  const handleInputChange = (value: string): void => {
    setQuery(value);
  };

  useEffect(() => {
    searchParams.set('name', debouncedQuery ?? '');
    setSearchParams(
      searchParams,
      // set 'same time' as ./page/index.tsx
      // replace true to retain browser navigation controls
      { replace: true }
    );

    // eslint-disable-next-line
  }, [debouncedQuery]);

  return (
    <div
      className='ml-auto rounded-full border border-black p-[1px]'
      onClick={props.onClick}
    >
      <Sheet
        onOpenChange={(open: boolean): void => {
          if (!open) {
            searchParams.set('name', '');
            setSearchParams(searchParams);
          }
        }}
      >
        <SheetTrigger asChild>
          <PlusIcon size={16} />
        </SheetTrigger>
        <SheetContent className='flex flex-col'>
          <SheetHeader className='px-4'>
            <SheetTitle>Add Leads</SheetTitle>
            <SheetDescription>For Listing: {listingID}</SheetDescription>
          </SheetHeader>
          <div className='px-4'>
            <Input
              placeholder='Search through your contacts'
              className='mt-4 focus-visible:ring-0'
              onChange={(e): void => {
                handleInputChange(e.currentTarget.value);
              }}
            />
          </div>

          <ScrollArea className='w-full flex-1 px-4'>
            {searchContacts.data?.length === 0 && (
              <p className='text-center text-gray-400'>No contacts found.</p>
            )}
            {searchContacts.data?.map((contact) => (
              <Lead
                key={`${contact.id}-${contact.name}`}
                listingID={listingID}
                contact={contact}
              />
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Lead({
  contact,
  listingID,
}: {
  contact: Contact;
  listingID: number;
}): JSX.Element {
  const addLead = useAddLead();
  return (
    <div
      key={contact.name}
      className='flex items-center justify-between py-2'
    >
      <p>{contact.name}</p>
      <SubmitButton
        onClick={(): void => {
          addLead.mutate({
            listingID: listingID,
            contactID: contact.id,
          });
        }}
        isLoading={addLead.isLoading}
        text='Save'
      ></SubmitButton>
    </div>
  );
}