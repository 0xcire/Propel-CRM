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
    path: '/listings',
  },
  {
    name: 'Contacts',
    path: '/contacts',
  },
  {
    name: 'Tasks',
    path: '/tasks',
  },
  {
    name: 'Analytics',
    path: '/analytics',
  },
];
