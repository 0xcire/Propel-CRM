import { Typography } from '@/components/ui/typography';

import { DashboardItemHeader } from '@/components/Layout/dashboard/DashboardItemHeader';
import { DashboardItemContent } from '@/components/Layout/dashboard/DashboardItemContent';

import { AddListing } from '../AddListing';
import { DashboardListings } from './DashboardListings';

export function DashboardListingView(): JSX.Element {
  return (
    <>
      <DashboardItemHeader>
        <Typography variant='h4'>Recent Listings</Typography>
        <AddListing />
      </DashboardItemHeader>
      <DashboardItemContent>
        <DashboardListings />
      </DashboardItemContent>
    </>
  );
}
