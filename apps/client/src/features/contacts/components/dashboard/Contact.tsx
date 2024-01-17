import { Link } from 'react-router-dom';

import { PhoneIcon, AtSignIcon, MapPinIcon } from 'lucide-react';

import { UpdateContact } from '../UpdateContact';
import { RemoveContact } from '../RemoveContact';
import { Avatar } from '@/components/Avatar';
import { Tooltip } from '@/components/Tooltip';

import type { ContactAsProp } from '../../types';

export function Contact({ contact }: ContactAsProp): JSX.Element {
  return (
    <div className='my-3 flex h-full items-center justify-between'>
      <div className='flex h-full'>
        <Avatar
          className='my-auto'
          name={contact.name}
        />
        <div className='ml-2 py-1'>
          <Link
            className='line-clamp-1 leading-none'
            to={`/contacts/${contact.id}`}
          >
            {contact.name}
          </Link>
          <div className='mt-1 flex w-max items-center justify-between'>
            <Tooltip content={contact.email}>
              <AtSignIcon
                className='cursor-pointer'
                size={16}
                tabIndex={0}
              />
            </Tooltip>

            <Tooltip content={contact.phoneNumber}>
              <PhoneIcon
                className='mx-2 cursor-pointer'
                size={16}
                tabIndex={0}
              />
            </Tooltip>

            <Tooltip content={contact.address}>
              <MapPinIcon
                className='cursor-pointer'
                size={16}
                tabIndex={0}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <div>
        <UpdateContact contact={contact} />
        <RemoveContact contact={contact} />
      </div>
    </div>
  );
}
