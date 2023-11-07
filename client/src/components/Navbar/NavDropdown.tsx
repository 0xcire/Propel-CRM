import { ChevronDownIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';

import { Avatar } from '../Avatar';

import type { NavProps } from './types';

export function NavDropdown({ name, username }: NavProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className='flex items-center justify-between gap-2 p-0 px-4'
        asChild
      >
        <Button
          variant='ghost'
          className='focus-visible:ring-0 focus-visible:ring-offset-0'
        >
          <Avatar
            className=''
            name={name as string}
          />

          <span className='text-sm'>{name as string}</span>

          <ChevronDownIcon
            size={16}
            className='ml-auto mt-[2px]'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Theme</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}