import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../ui/navigation-menu';

import { CustomLink } from './CustomLink';

import { navLinks } from '@/config/nav';

export function NavMenu(): JSX.Element {
  return (
    <NavigationMenu
      orientation='vertical'
      className='max-w-full'
    >
      <NavigationMenuList
        aria-orientation='vertical'
        className='w-inherit flex-col items-start space-x-0'
      >
        {navLinks.map((link) => (
          <NavigationMenuItem
            className='w-full'
            key={link.name}
          >
            <CustomLink path={link.path}>
              {link.icon}
              {link.name}
            </CustomLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
