import {
  BarChart3,
  ContactIcon,
  HomeIcon,
  ListTodoIcon,
  LayoutDashboardIcon,
} from 'lucide-react';

import { getCurrentYear } from '@/utils';

type NavLinksProps = Array<{
  name: string;
  path: string;
  icon: JSX.Element;
}>;

export const navLinks: NavLinksProps = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: <LayoutDashboardIcon size={16} />,
  },
  {
    name: 'Listings',
    path: '/listings?page=1&status=active',
    icon: <HomeIcon size={16} />,
  },
  {
    name: 'Contacts',
    path: '/contacts?page=1',
    icon: <ContactIcon size={16} />,
  },
  {
    name: 'Tasks',
    path: '/tasks?page=1&completed=false',
    icon: <ListTodoIcon size={16} />,
  },
  {
    name: 'Analytics',
    path: `/analytics?year=${getCurrentYear()}`,
    icon: <BarChart3 size={16} />,
  },
];
