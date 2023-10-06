type NavLinksProps = Array<{
  name: string;
  path: string;
}>;

export const navLinks: NavLinksProps = [
  {
    name: 'Home',
    path: '/dashboard',
  },
  {
    name: 'Listings',
    path: '/listings?page=1&status=active',
  },
  {
    name: 'Contacts',
    path: '/contacts',
  },
  {
    name: 'Tasks',
    path: '/tasks?page=1&completed=false',
  },
  {
    name: 'Analytics',
    path: '/analytics',
  },
];
