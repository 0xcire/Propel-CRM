import { Typography } from '@/components/ui/typography';
import { PhoneIcon, AtSignIcon, MapPinIcon } from 'lucide-react';

import { Avatar, Tooltip } from '@/components';
import { UpdateContact } from './UpdateContact';
import { RemoveContact } from './RemoveContact';

import { type Contact as ContactInfo } from '../api';

type ContactProps = {
  contact: ContactInfo;
};

export function Contact({ contact }: ContactProps): JSX.Element {
  return (
    <div
      data-id={contact.id}
      className='h-content my-3 flex items-center justify-between'
    >
      <div className='flex h-full'>
        <Avatar
          className='my-auto'
          name={contact.name}
        />
        <div className='ml-2 py-1'>
          <Typography
            className='leading-none'
            variant='p'
          >
            {contact.name}
          </Typography>
          <div className='mt-1 flex w-max items-center justify-between'>
            <Tooltip content={contact.email}>
              <AtSignIcon
                className='cursor-pointer'
                size={16}
              />
            </Tooltip>

            <Tooltip content={contact.phoneNumber}>
              <PhoneIcon
                className='mx-2 cursor-pointer'
                size={16}
              />
            </Tooltip>

            <Tooltip content={contact.address}>
              <MapPinIcon
                className='cursor-pointer'
                size={16}
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
