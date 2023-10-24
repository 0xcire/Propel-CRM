import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSearchContacts } from '@/features/contacts/hooks/useSearchContacts';
import { useAddLead } from '../../../hooks/useAddLead';

import { useDebounce } from '@/hooks/useDebounce';
import { useNameQuerySearchParams } from '@/hooks';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
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
  const debouncedNameQuery = useDebounce(query, 200);

  // TODO: consider extracting into shared dir. revisit when building tasks page
  const searchContacts = useSearchContacts();

  const handleInputChange = (value: string): void => {
    setQuery(value);
  };

  useNameQuerySearchParams(debouncedNameQuery);

  return (
    <div
      className='w-full cursor-pointer'
      onClick={props.onClick}
    >
      <Sheet
        onOpenChange={(open: boolean): void => {
          if (!open) {
            searchParams.delete('name');
            setSearchParams(searchParams);
          }
        }}
      >
        <SheetTrigger asChild>
          <DropdownMenuItem
            className='cursor-pointer'
            onSelect={(e): void => e.preventDefault()}
          >
            Add Lead
          </DropdownMenuItem>
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
