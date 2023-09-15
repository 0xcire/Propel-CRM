import { currency, dateIntl, number } from '@/utils/intl';

import type { ColumnDef } from '@tanstack/react-table';
import type { Listing } from '../types';

export const listingColumns: Array<ColumnDef<Listing>> = [
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'propertyType',
    header: 'Property Type',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }): string => {
      const price: string = row.getValue('price');
      const formatted = currency.format(+price);
      // TODO: dont input number with .00 format into db
      return formatted.split('.')[0] as string;
    },
  },
  {
    accessorKey: 'bedrooms',
    header: 'Beds',
  },
  {
    accessorKey: 'baths',
    header: 'Baths',
  },
  {
    accessorKey: 'squareFeet',
    header: 'Sq Ft',
    cell: ({ row }): string => {
      const sqft: number = row.getValue('squareFeet');
      return number.format(sqft);
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Listed Date',
    cell: ({ row }): string => {
      const date = new Date(row.getValue('createdAt'));
      return dateIntl.format(date);
    },
  },
];
