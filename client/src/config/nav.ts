type NavLinksProps = Array<{
  name: string;
  path: string;
}>;

const currentYear = new Date().getFullYear();

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
    path: '/contacts?page=1',
  },
  {
    name: 'Tasks',
    path: '/tasks?page=1&completed=false',
  },
  {
    name: 'Analytics',
    path: `/analytics?year=${currentYear}`,
  },
];
