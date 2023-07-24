import { twMerge } from 'tailwind-merge';
import { Settings } from 'lucide-react';
import { Avatar } from './Avatar';
import { CustomLink } from './CustomLink';
import {
  NavigationMenu,
  //   NavigationMenuContent,
  //   NavigationMenuIndicator,
  NavigationMenuItem,
  //   NavigationMenuLink,
  NavigationMenuList,
  //   NavigationMenuTrigger,
  //   NavigationMenuViewport,
} from './ui/navigation-menu';
import { Typography } from './ui/typography';
import { Link } from 'react-router-dom';

type NavContentProps = {
  className?: string;
  name: string;
};

export function NavContent({ className, name }: NavContentProps): JSX.Element {
  return (
    <div
      className={twMerge(
        'flex h-full flex-col px-4 py-10 xl:border-r-2',
        className
      )}
    >
      <Typography
        variant='h2'
        className='hidden xl:block'
      >
        Propel CRM
      </Typography>
      <NavigationMenu
        orientation='vertical'
        className='m-auto'
      >
        <NavigationMenuList
          aria-orientation='vertical'
          className='flex-col xl:flex-1'
        >
          <NavigationMenuItem>
            <CustomLink path='/listings'>Listings</CustomLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <CustomLink path='/contacts'>Contacts</CustomLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <CustomLink path='/tasks'>Tasks</CustomLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <CustomLink path='/analytics'>Analytics</CustomLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className=' mx-auto flex items-center'>
        <Avatar name={name} />

        <Typography
          variant='p'
          className='mx-3 [&:not(:first-child)]:mt-0'
        >
          {name}
        </Typography>

        <Link to='/settings'>
          <Settings size={20} />
        </Link>
      </div>
    </div>
  );
}
