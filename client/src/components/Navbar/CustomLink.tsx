// per: https://www.radix-ui.com/docs/primitives/components/navigation-menu#with-client-side-routing

import { Link, useLocation } from 'react-router-dom';
import { NavigationMenuLink } from '../ui/navigation-menu';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';

type CustomLinkProps = {
  path: string;
  children: string;
};

// matchRoutes?

export function CustomLink({
  path,
  children,
  ...props
}: CustomLinkProps): JSX.Element {
  const location = useLocation();
  const isActive = location.pathname === path;
  return (
    <NavigationMenuLink
      className={navigationMenuTriggerStyle()}
      active={isActive}
      {...props}
      asChild
    >
      <Link to={path}>{children}</Link>
    </NavigationMenuLink>
  );
}
