import { UpdateContact } from '../UpdateContact';
import { RemoveContact } from '../RemoveContact';

import { Typography } from '@/components/ui/typography';
import { PhoneIcon, AtSignIcon, MapPinIcon } from 'lucide-react';

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
          <Typography
            className='line-clamp-1 leading-none'
            variant='p'
          >
            {contact.name}
          </Typography>
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
