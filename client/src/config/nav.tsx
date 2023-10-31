import { BarChart3, ContactIcon, HomeIcon, ListTodoIcon } from 'lucide-react';
import { LayoutDashboardIcon } from 'lucide-react';

type NavLinksProps = Array<{
  name: string;
  path: string;
  icon: JSX.Element;
}>;

const currentYear = new Date().getFullYear();

export const navLinks: NavLinksProps = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: <LayoutDashboardIcon size={18} />,
  },
  {
    name: 'Listings',
    path: '/listings?page=1&status=active',
    icon: <HomeIcon size={18} />,
  },
  {
    name: 'Contacts',
    path: '/contacts?page=1',
    icon: <ContactIcon size={18} />,
  },
  {
    name: 'Tasks',
    path: '/tasks?page=1&completed=false',
    icon: <ListTodoIcon size={18} />,
  },
  {
    name: 'Analytics',
    path: `/analytics?year=${currentYear}`,
    icon: <BarChart3 size={18} />,
  },
];
