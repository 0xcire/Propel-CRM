import { Typography } from '@/components/ui/typography';

import { DashboardItemContent } from '@/components/Layout/dashboard';
import { DashboardItemHeader } from '@/components/Layout/dashboard';

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
