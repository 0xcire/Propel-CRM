import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSearchContacts } from '@/features/contacts/hooks/useSearchContacts';
import { useAddLead } from '../../../hooks/useAddLead';

import { useDebouncedQuerySearchParams } from '@/hooks';

import { Virtuoso } from 'react-virtuoso';
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

import { Spinner, SubmitButton } from '@/components';

import { twMerge } from 'tailwind-merge';

import type { ComponentProps } from 'react';
import type { Contact } from '@/features/contacts/types'; // ?

interface AddLeadProps extends ComponentProps<'div'> {
  listingID: number;
}

export function AddLead({ listingID, ...props }: AddLeadProps): JSX.Element {
  const [parentElement, setParentElement] = useState<HTMLDivElement | null>(
    null
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const searchContacts = useSearchContacts({ addLead: true });
  const { setQuery } = useDebouncedQuerySearchParams('name');

  const scrollAreaViewport = parentElement?.children[1] as
    | HTMLElement
    | undefined;

  const handleInputChange = (value: string): void => {
    setQuery(value);
  };

  const renderSearchResults = (): JSX.Element => {
    if (searchContacts.data) {
      if (searchContacts.data.length === 0) {
        return <p className='text-center text-gray-400'>No contacts found.</p>;
      }

      if (searchContacts.data.length < 50) {
        return (
          <>
            {searchContacts.data.map((contact) => (
              <Lead
                key={`${contact.id}-${contact.name}`}
                contact={contact}
                listingID={listingID}
              />
            ))}
          </>
        );
      }

      // this isn't 100% necesssary, more so want to play around with the concept
      if (searchContacts.data.length >= 50) {
        return (
          <Virtuoso
            data={searchContacts.data}
            itemContent={(index, contact): JSX.Element => (
              <Lead
                key={`${index}-${contact}`}
                listingID={listingID}
                contact={contact}
              />
            )}
            customScrollParent={scrollAreaViewport}
          />
        );
      }
    }

    return <></>;
  };

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
              onKeyUp={(e): void => {
                if (e.key === 'Backspace' && e.currentTarget.value === '') {
                  searchParams.delete('name');
                  setSearchParams(searchParams);
                }
              }}
            />
          </div>

          {searchContacts.isInitialLoading ? (
            <Spinner
              className='mb-auto'
              variant='md'
              fillContainer
            />
          ) : (
            <ScrollArea
              ref={setParentElement}
              className='h-full px-4'
            >
              {renderSearchResults()}
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface LeadProps extends ComponentProps<'div'> {
  contact: Contact;
  listingID: number;
}

function Lead({ contact, listingID, ...props }: LeadProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const addLead = useAddLead();
  return (
    <div
      style={props.style}
      key={contact.name}
      className={twMerge(
        'flex items-center justify-between py-2',
        props.className
      )}
    >
      <p>{contact.name}</p>
      <SubmitButton
        className='mr-1 h-8'
        onClick={(): void => {
          addLead.mutate(
            {
              listingID: listingID,
              contactID: contact.id,
            },
            {
              onSuccess: () => {
                searchParams.delete('name');
                setSearchParams(searchParams);
              },
            }
          );
        }}
        isLoading={addLead.isLoading}
      >
        Save
      </SubmitButton>
    </div>
  );
}
