// per: https://www.radix-ui.com/docs/primitives/components/navigation-menu#with-client-side-routing

import { Link, useLocation } from 'react-router-dom';

import { Link as RadixLink } from '@radix-ui/react-navigation-menu';
import { NavigationMenuLink } from '../ui/navigation-menu';

import { navigationMenuTriggerStyle } from '../ui/navigation-menu';
import { twMerge } from 'tailwind-merge';

import type { ComponentProps, PropsWithChildren } from 'react';

interface CustomLinkProps
  extends ComponentProps<typeof RadixLink>,
    PropsWithChildren {
  path: string;
}

export function CustomLink({
  path,
  children,
  ...props
}: CustomLinkProps): JSX.Element {
  const location = useLocation();
  const isActive = location.pathname === path.split('?')[0];
  return (
    <NavigationMenuLink
      active={isActive}
      {...props}
      asChild
    >
      <Link
        className={twMerge(navigationMenuTriggerStyle() + props.className)}
        to={path}
      >
        {children}
      </Link>
    </NavigationMenuLink>
  );
}
