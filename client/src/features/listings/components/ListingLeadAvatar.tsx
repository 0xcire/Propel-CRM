import { AtSignIcon, PhoneIcon } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Avatar, LinkButton } from '@/components';
import { Tooltip } from '@/components';

import { RemoveLead } from './RemoveLead';

import { extractInitials } from '@/utils/';

import type { MouseEventHandler } from 'react';
import type { ContactInfo } from '../types';

type HoverAvatarProps = {
  contactInfo: ContactInfo;
  listingID: number;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function ListingLeadAvatar({
  contactInfo,
  listingID,
  onClick,
}: HoverAvatarProps): JSX.Element {
  const { toast } = useToast();
  return (
    <HoverCard>
      <HoverCardTrigger
        onClick={onClick}
        className='p-0 px-2'
        asChild
      >
        <Button variant='link'>{extractInitials(contactInfo.name)}</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className='flex justify-between gap-4'>
          <Avatar name={contactInfo.name} />

          <div className='-m-[2px] mr-auto w-fit space-y-1'>
            <LinkButton
              className='pl-0 font-bold'
              path={`/contacts/${contactInfo.id}`}
              variant='link'
            >
              {contactInfo.name}
            </LinkButton>
            <p className='text-sm'>This lead was established X days ago.</p>

            <div className='flex items-center gap-2 pt-0'>
              <div className='flex cursor-pointer items-center gap-1'>
                <Tooltip content={contactInfo.phone}>
                  <div className='flex items-center gap-1'>
                    <PhoneIcon
                      className='mt-1 cursor-pointer'
                      onClick={(): void => {
                        navigator.clipboard.writeText(contactInfo.phone);
                        toast({
                          description: `Copied ${contactInfo.name}'s number to your clipboard`,
                        });
                      }}
                      size={16}
                    />

                    <p>phone</p>
                  </div>
                </Tooltip>
              </div>

              <div className='flex cursor-pointer items-center gap-1'>
                <Tooltip content={contactInfo.email}>
                  <div className='flex items-center gap-1'>
                    <AtSignIcon
                      className='mt-1 cursor-pointer'
                      onClick={(): void => {
                        window.location =
                          `mailto:${contactInfo.email}` as string & Location;
                        navigator.clipboard.writeText(contactInfo.email);
                        toast({
                          description: `Copied ${contactInfo.name}'s email to your clipboard`,
                        });
                      }}
                      size={16}
                    />

                    <p>email</p>
                  </div>
                </Tooltip>
              </div>

              <RemoveLead
                listingID={listingID}
                contactInfo={contactInfo}
              />
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
