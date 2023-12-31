import { useParams } from 'react-router-dom';

import { useContact } from '../../hooks/useContact';
import { useContactTasks } from '@/features/tasks/hooks/useContactTasks';
import { useContactListings } from '@/features/listings/hooks/useContactListings';

import {
  AtSignIcon,
  Building2Icon,
  CakeIcon,
  FlagIcon,
  MapPinIcon,
  PhoneIcon,
  SendIcon,
  UserIcon,
} from 'lucide-react';

import { Typography } from '@/components/ui/typography';

import { NestedNotFound } from '@/components/Layout/page/NestedNotFound';
import { Avatar } from '@/components/Avatar';
import { Spinner } from '@/components/Spinner';
import { UpdateContact } from '../UpdateContact';
import { ContactGridItem } from './ContactGridItem';
import { ContactTasks } from './ContactTasks';
import { ContactListings } from './ContactListings';

import { formatDateString } from '@/utils/intl';

// TODO: instead of string manipulation, just create more individual columns
// would need to refactor contact form
// to add:
// relationships (other team members)
// related notes
// emails
// invididual qualifying info, interested property type, occupation, price range, etc

export function ContactRoute(): JSX.Element {
  const { contactID } = useParams();

  const contact = useContact(+(contactID as string));
  const tasks = useContactTasks(+(contactID as string));
  const listings = useContactListings(+(contactID as string));

  if (contact.isLoading) {
    return (
      <Spinner
        variant='md'
        fillContainer
      />
    );
  }

  if (!contact.data || !contact.data[0]) {
    return <NestedNotFound context='contact' />;
  }

  // TODO: as mentioned above, this is fragile. works due to uniform seed data
  // or maybe create regex to match
  const address = contact.data[0].address;
  const addressSplit = address.split(',');
  const stateAndZipcode = addressSplit[2];
  const stateAndZipcodeSplit = stateAndZipcode?.split(' ');
  const street = addressSplit[0];
  const city = addressSplit[1]?.trim();
  const state = stateAndZipcodeSplit && stateAndZipcodeSplit[1];
  const zipcode = stateAndZipcodeSplit && stateAndZipcodeSplit[2];

  return (
    <div className='mt-4 grid h-full grid-cols-12 grid-rows-6 gap-4 rounded-md border border-border'>
      <ContactGridItem className='col-start-1 col-end-13 row-start-1 row-end-2 flex items-center justify-between rounded-none border-l-0 border-r-0 border-t-0 shadow-none'>
        <div className='flex items-start gap-2'>
          <Avatar
            className='h-16 w-16 text-lg'
            name={contact.data[0].name}
          />
          <div>
            <Typography
              variant='h3'
              className='text-lg'
            >
              {contact.data[0].name}
            </Typography>
            <div className='mt-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-4'>
                <PhoneIcon
                  className='mt-[2px]'
                  size={16}
                />
                <p>{contact.data[0].phoneNumber}</p>
              </div>
              <div className='flex items-center gap-4'>
                <AtSignIcon
                  className='mt-[2px]'
                  size={16}
                />
                <p>{contact.data[0].email}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className='font-bold'>{listings.data?.length}</p>
          <p className='text-sm text-muted-foreground'>listings</p>
        </div>
        <div>
          <p className='font-bold'>{tasks.data?.length}</p>
          <p className='text-sm text-muted-foreground'>upcoming tasks</p>
        </div>

        <UpdateContact contact={contact.data[0]} />
      </ContactGridItem>

      <ContactGridItem className='col-start-1 col-end-5 row-start-2 row-end-7 mb-4 ml-4'>
        <Typography
          variant='h4'
          className='text-lg'
        >
          Account Info
        </Typography>
        <div className='mt-4 flex flex-col gap-2 text-sm'>
          <div className='flex items-center gap-2'>
            <UserIcon size={18} />
            <p>
              First Name:{' '}
              <span className='font-bold'>
                {contact.data[0].name.split(' ')[0]}
              </span>
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <UserIcon size={18} />
            <p>
              Last Name:{' '}
              <span className='font-bold'>
                {contact.data[0].name.split(' ')[1]}
              </span>
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <CakeIcon size={18} />
            <p>
              Added:{' '}
              <span className='font-bold'>
                {formatDateString(contact.data[0].createdAt)}
              </span>
            </p>
          </div>
        </div>
      </ContactGridItem>

      <ContactGridItem className='col-start-5 col-end-9 row-start-2 row-end-7 mb-4'>
        <Typography
          variant='h4'
          className='text-lg'
        >
          Contact Info
        </Typography>
        <div className='mt-4 flex flex-col gap-2 text-sm '>
          <div className='flex items-center gap-2'>
            <FlagIcon size={18} />
            <p>
              State: <span className='font-bold'>{state}</span>
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Building2Icon size={18} />
            <p>
              City: <span className='font-bold'>{city}</span>
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <MapPinIcon size={18} />
            <p>
              Address: <span className='font-bold'>{street}</span>
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <SendIcon size={18} />
            <p>
              Zipcode: <span className='font-bold'>{zipcode}</span>
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <PhoneIcon size={18} />
            <p>
              Phone:
              <span className='font-bold'>{contact.data[0].phoneNumber}</span>
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <AtSignIcon size={18} />
            <p>
              Email: <span className='font-bold'>{contact.data[0].email}</span>
            </p>
          </div>
        </div>
      </ContactGridItem>

      <ContactGridItem className='col-start-9 col-end-13 row-start-2 row-end-4 mr-4 pt-0'>
        <ContactListings listings={listings} />
      </ContactGridItem>

      <ContactGridItem className='col-start-9 col-end-13 row-start-4 row-end-7 mb-4 mr-4 pt-0'>
        <ContactTasks
          tasks={tasks}
          contactID={+(contactID as string)}
        />
      </ContactGridItem>
    </div>
  );
}
