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
import { extractInitials } from '@/utils/name';
import { RemoveLead } from './page/RemoveLead';
import type { ContactInfo } from '../types';
import type { MouseEventHandler } from 'react';

type HoverAvatarProps = {
  contactInfo: ContactInfo;
  listingID: number;
  onClick: MouseEventHandler<HTMLAnchorElement>;
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

        {/* <Avatar name={contactInfo.name} /> */}
      </HoverCardTrigger>
      <HoverCardContent>
        <div className='flex justify-between gap-4'>
          <Avatar name={contactInfo.name} />

          <div className='mr-auto w-fit space-y-1'>
            <h4 className='text-sm font-semibold'>{contactInfo.name}</h4>

            <LinkButton
              path={`/contacts/${contactInfo.id}`}
              variant='outline'
              text='View Details'
            />
            {/* <p className='text-sm'>This lead was established X days ago.</p> */}
            <div className='flex items-center gap-2 pt-2'>
              <Tooltip content={contactInfo.phone}>
                <PhoneIcon
                  onClick={(e): void => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(contactInfo.phone);
                    toast({
                      description: `Copied ${contactInfo.name}'s number to your clipboard`,
                    });
                  }}
                  size={16}
                />
              </Tooltip>
              <Tooltip content={contactInfo.email}>
                <AtSignIcon
                  onClick={(e): void => {
                    e.stopPropagation();
                    window.location = `mailto:${contactInfo.email}` as string &
                      Location;
                    navigator.clipboard.writeText(contactInfo.email);
                    toast({
                      description: `Copied ${contactInfo.name}'s email to your clipboard`,
                    });
                  }}
                  size={16}
                />
              </Tooltip>

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
