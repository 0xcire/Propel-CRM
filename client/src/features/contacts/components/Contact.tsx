// import { type NewContact } from '../api';

import { Avatar, Tooltip } from '@/components';
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
    <div className='flex items-center justify-between'>
      <div className='flex'>
        <Avatar name={name} />
        <div className='ml-2'>
          <p>{name}</p>
          <div className='flex items-center justify-between'>
            <Tooltip content={email}>
              <AtSignIcon
                className='cursor-pointer'
                size={16}
              />
            </Tooltip>

            <Tooltip content={phone}>
              <PhoneIcon
                className='cursor-pointer'
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
