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

import { twMerge } from 'tailwind-merge';

import { extractInitials } from '@/utils/';

import type { MouseEventHandler } from 'react';
import type { ContactInfo } from '../types';

type HoverAvatarProps = {
  contactInfo: ContactInfo;
  listingID: number;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
};

export function ListingLeadAvatar({
  contactInfo,
  listingID,
  onClick,
  className,
}: HoverAvatarProps): JSX.Element {
  const searchParams = new URLSearchParams(window.location.search);
  const { toast } = useToast();

  const status = searchParams.get('status');

  return (
    <HoverCard
      openDelay={50}
      closeDelay={50}
    >
      <HoverCardTrigger
        onClick={onClick}
        className={twMerge('p-0 px-2', className)}
        asChild
      >
        <Button variant='link'>{extractInitials(contactInfo.name)}</Button>
      </HoverCardTrigger>
      <HoverCardContent className='border-border'>
        <div className='flex justify-between gap-4'>
          <Avatar name={contactInfo.name} />

          <div className='-m-[5px] mr-auto w-fit'>
            <LinkButton
              className='pb-0 pl-0 font-bold'
              path={`/contacts/${contactInfo.id}`}
              variant='link'
            >
              {contactInfo.name}
            </LinkButton>
            <p className='pb-2 text-sm text-gray-500'>
              {status === 'active' || !status
                ? `Added ${contactInfo.days} days ago.`
                : `Closed in ${contactInfo.days} days.`}
            </p>

            <div className='flex flex-col items-center gap-2 pt-2'>
              <div className='mr-auto flex items-center gap-2'>
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

                      <p>Phone</p>
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

                      <p>Email</p>
                    </div>
                  </Tooltip>
                </div>
              </div>
              {status === 'active' && (
                <RemoveLead
                  listingID={listingID}
                  contactInfo={contactInfo}
                />
              )}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
