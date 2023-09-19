import { AtSignIcon, PhoneIcon } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Avatar } from '@/components';
import { Tooltip } from '@/components';

type HoverAvatarProps = {
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
};

export function ListingLeadAvatar({
  contactInfo,
}: HoverAvatarProps): JSX.Element {
  const { toast } = useToast();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant='link'>
          {contactInfo.name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()}
        </Button>

        {/* <Avatar name={contactInfo.name} /> */}
      </HoverCardTrigger>
      <HoverCardContent className='w-80'>
        <div className='flex justify-between space-x-4'>
          <Avatar name={contactInfo.name} />

          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>{contactInfo.name}</h4>
            <p className='text-sm'>This lead was established X days ago.</p>
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
                  }}
                  size={16}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
