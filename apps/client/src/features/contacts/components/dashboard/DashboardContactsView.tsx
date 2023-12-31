import { Typography } from '@/components/ui/typography';

import { DashboardItemContent } from '@/components/Layout/dashboard/DashboardItemContent';
import { DashboardItemHeader } from '@/components/Layout/dashboard/DashboardItemHeader';

import { AddContact } from '../AddContact';
import { DashboardContacts } from './DashboardContacts';

export function DashboardContactsView(): JSX.Element {
  return (
    <>
      <DashboardItemHeader>
        <Typography variant='h4'>Contacts</Typography>
        <AddContact />
      </DashboardItemHeader>

      <DashboardItemContent>
        <DashboardContacts />
      </DashboardItemContent>
    </>
  );
}
