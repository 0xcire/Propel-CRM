import { useUser } from '@/lib/react-query-auth';

import { useIsDesktop } from '@/hooks/useIsDesktop';

import { Menu, Settings } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';

import { LinkButton } from '../LinkButton';
import { NavDropdown } from './NavDropdown';
import { NavMenu } from './NavMenu';

import type { NavProps } from './types';

export function Navbar(): JSX.Element {
  const isDesktop = useIsDesktop();
  const user = useUser();

  return (
    <>
      {isDesktop ? (
        <SideNav
          name={user.data?.name}
          username={user.data?.username}
        />
      ) : (
        <MobileSideNav
          name={user.data?.name}
          username={user.data?.username}
        />
      )}
    </>
  );
}

function MobileSideNav({ name, username }: NavProps): JSX.Element {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu
          className='mt-[2px]'
          size={20}
        />
      </SheetTrigger>
      <SheetContent
        side='left'
        className='flex w-[225px] flex-col py-10'
      >
        <SheetHeader>
          <NavDropdown
            name={name}
            username={username}
          />
        </SheetHeader>
        <NavMenu />

        <SettingsLink />
      </SheetContent>
    </Sheet>
  );
}

function SideNav({ name, username }: NavProps): JSX.Element {
  return (
    <div className='flex h-full w-1/6 max-w-[200px] flex-col border-r-2 px-4 py-4'>
      <NavDropdown
        name={name}
        username={username}
      />

      <NavMenu />

      <SettingsLink />
    </div>
  );
}

function SettingsLink(): JSX.Element {
  return (
    <LinkButton
      className='flex items-center justify-start gap-2 px-8 text-sm'
      path='/profile'
      variant='ghost'
    >
      <Settings
        className='mt-[2px]'
        size={16}
      />
      Settings
    </LinkButton>
  );
}
