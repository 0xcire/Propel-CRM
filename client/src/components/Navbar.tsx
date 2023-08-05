import { Link } from 'react-router-dom';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from './ui/navigation-menu';
import { Typography } from './ui/typography';
import { Menu, Settings } from 'lucide-react';

import { CustomLink } from './CustomLink';
import { Avatar } from './Avatar';

import { navLinks } from '@/config';

type NavProps = {
  name: string;
};

export function Navbar({ name }: { name: string }): JSX.Element {
  const isDesktop = useIsDesktop();

  return (
    <>{isDesktop ? <SideNav name={name} /> : <MobileSideNav name={name} />}</>
  );
}

function MobileSideNav({ name }: NavProps): JSX.Element {
  return (
    <Sheet>
      <SheetTrigger className='absolute left-5 top-5'>
        <Menu />
      </SheetTrigger>
      <SheetContent
        side='left'
        className='flex w-[300px] flex-col'
      >
        <SheetHeader>
          <SheetTitle className='mx-auto text-2xl'>Propel CRM</SheetTitle>
        </SheetHeader>
        <NavigationMenu
          orientation='vertical'
          className='m-auto'
        >
          <NavigationMenuList
            aria-orientation='vertical'
            className='flex-col items-start'
          >
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.name}>
                <SheetClose asChild>
                  <CustomLink path={link.path}>{link.name}</CustomLink>
                </SheetClose>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className='mx-auto flex items-center'>
          <Avatar name={name} />

          <Typography
            variant='p'
            className='mx-3 text-sm'
          >
            {name}
          </Typography>

          <SheetClose asChild>
            <Link to='/profile'>
              <Settings size={18} />
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SideNav({ name }: NavProps): JSX.Element {
  return (
    <div className='flex h-full w-1/6 max-w-[300px] flex-col border-r-2 px-4 py-10'>
      <Typography
        variant='h2'
        className='text-center'
      >
        Propel CRM
      </Typography>
      <NavigationMenu
        orientation='vertical'
        className='m-auto'
      >
        <NavigationMenuList
          aria-orientation='vertical'
          className='flex-col items-start'
        >
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.name}>
              <CustomLink path={link.path}>{link.name}</CustomLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className='mx-auto flex items-center'>
        <Avatar name={name} />

        <Typography
          variant='p'
          className='mx-3 text-sm'
        >
          {name}
        </Typography>

        <Link to='/profile'>
          <Settings size={20} />
        </Link>
      </div>
    </div>
  );
}
