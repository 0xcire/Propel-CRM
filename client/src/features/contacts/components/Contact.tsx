// import { type NewContact } from '../api';

import { Avatar, Tooltip } from '@/components';
import { Typography } from '@/components/ui/typography';
import { PhoneIcon, AtSignIcon, MapPinIcon, PencilIcon } from 'lucide-react';

// type ContactProps = NewContact;

type ContactProps = {
  name: string;
  email: string;
  phone: string;
  address: string;
};
export function Contact({
  name,
  email,
  phone,
  address,
}: ContactProps): JSX.Element {
  return (
    <div className='h-content my-3 flex items-center justify-between'>
      <div className='flex h-full'>
        <Avatar
          className='my-auto'
          name={name}
        />
        <div className='ml-2 py-1'>
          <Typography
            className='leading-none'
            variant='p'
          >
            {name}
          </Typography>
          <div className='mt-1 flex w-max items-center justify-between'>
            <Tooltip content={email}>
              <AtSignIcon
                className='cursor-pointer'
                size={16}
              />
            </Tooltip>

            <Tooltip content={phone}>
              <PhoneIcon
                className='mx-2 cursor-pointer'
                size={16}
              />
            </Tooltip>

            <Tooltip content={address}>
              <MapPinIcon
                className='cursor-pointer'
                size={16}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <Tooltip content='edit'>
        <PencilIcon
          className='cursor-pointer'
          size={20}
        />
      </Tooltip>
    </div>
  );
}
