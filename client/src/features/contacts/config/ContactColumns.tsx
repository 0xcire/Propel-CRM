// import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { toast } from '@/components/ui/use-toast';

// import { currency, dateIntl, number } from '@/utils/intl';

import type { ColumnDef } from '@tanstack/react-table';
import type { Contact } from '../types';

export const listingColumns: Array<ColumnDef<Contact>> = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone #',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
];
