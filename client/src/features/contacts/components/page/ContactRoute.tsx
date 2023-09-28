import { useNavigate, useParams } from 'react-router-dom';

import { useContact } from '../../hooks/useContact';

import { AtSignIcon, PhoneIcon } from 'lucide-react';

import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

import { Avatar, Spinner } from '@/components';

import { UpdateContact } from '../UpdateContact';

export function ContactRoute(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();

  const contact = useContact(+(id as string));

  // TODO: need to reseed and update some columns before finishing this page.

  // current available data points:
  // interested listings
  // related tasks
  // relationships (other team members)

  // to add:

  // related notes
  // emails
  // invididual qualifying info, interested property type, occupation, price range, etc

  if (contact.isLoading) {
    return (
      <div className='grid h-full w-full flex-1 place-items-center'>
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
    );
  }

  // TODO: extract -> <NestedNotFound />
  if (!contact.data || !contact.data[0]) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <div>
          <Typography variant='h4'>404! We can't find that contact.</Typography>
          <Button onClick={(): void => navigate(-1)}>Go back</Button>
        </div>
      </div>
    );
  }

  return (
    // absolute
    <div className='grid h-full grid-cols-12 grid-rows-6 gap-4'>
      <div className='col-start-1 col-end-13 row-start-1 row-end-2 flex items-center justify-between rounded-md border-b p-4'>
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
            <div className='mt-2 text-sm text-slate-700'>
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
          <p className='font-bold'>2</p>
          <p className='text-sm text-slate-700'>listings</p>
        </div>
        <div>
          <p className='font-bold'>4</p>
          <p className='text-sm text-slate-700'>related tasks</p>
        </div>

        <UpdateContact contact={contact.data[0]} />
      </div>

      {/* <div className='col-start-1 col-end-4 row-start-2 row-end-7 mb-4 ml-4 rounded-md border shadow'>
        <Typography
          variant='h4'
          className='text-md'
        >
          Account Info
        </Typography>
        <div className='text-sm'>
          <p>first:</p>
          <p>last:</p>
          <p>DOB:</p>
          <p>Occupation:</p>
          <p>Account Type:</p>
        </div>
      </div>

      <div className='col-start-4 col-end-8 row-start-2 row-end-7 mb-4 rounded-md border shadow'>
        <Typography
          variant='h4'
          className='text-md'
        >
          Contact Info
        </Typography>
        <div className='text-sm'>
          <p>Country:</p>
          <p>State:</p>
          <p>City:</p>
          <p>Address:</p>
          <p>Zipcode:</p>
          <p>Phone:</p>
          <p>Email:</p>
        </div>
      </div>

      <div className='col-start-9 col-end-13 row-start-2 row-end-4 mr-4 rounded-md border shadow'>
        <Typography
          variant='h4'
          className='text-md'
        >
          Listings
        </Typography>
        <div className='text-sm'>
          <div>
            <p>Listing ID: 372</p>
          </div>
        </div>
      </div>

      <div className='col-start-9 col-end-13 row-start-4 row-end-7 mb-4 mr-4 rounded-md border shadow'>
        <Typography
          variant='h4'
          className='text-md'
        >
          Related Tasks
        </Typography>
      </div> */}
    </div>
  );
}
