import { Link } from 'react-router-dom';

import { useLogout } from '@/lib/react-query-auth';

import { ChevronDownIcon, LogOutIcon, SettingsIcon } from 'lucide-react';

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
import { ThemeToggle } from './ThemeToggle';

import type { NavProps } from './types';

export function NavDropdown({ name, username }: NavProps): JSX.Element {
  const logout = useLogout();

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
          <Avatar name={name as string} />

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
        <DropdownMenuItem
          className='cursor-pointer'
          asChild
        >
          <Link to='/profile'>
            <SettingsIcon
              size={18}
              className='mr-1 mt-[2px]'
            />
            Settings
          </Link>
        </DropdownMenuItem>

        <ThemeToggle />

        <DropdownMenuItem
          className='cursor-pointer'
          onClick={(): void => logout.mutate()}
        >
          <LogOutIcon
            className='mr-1 mt-[2px]'
            size={18}
          />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
