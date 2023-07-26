type NavLinksProps = Array<{
  name: string;
  path: string;
}>;

export const navLinks: NavLinksProps = [
  {
    name: 'Home',
    path: '/protected',
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
