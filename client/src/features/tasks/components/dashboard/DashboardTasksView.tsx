import { Typography } from '@/components/ui/typography';

import { DashboardItemHeader } from '@/components/Layout/dashboard';
import { DashboardItemContent } from '@/components/Layout/dashboard';

import { TaskDropdown } from './TaskDropdown';
import { DashboardTasks } from './DashboardTasks';
import { TaskProvider } from '../../context/TaskContext';

export function DashboardTasksView(): JSX.Element {
  return (
    <TaskProvider>
      <DashboardItemHeader>
        <Typography variant='h4'>Tasks</Typography>
        <TaskDropdown />
      </DashboardItemHeader>

      <DashboardItemContent>
        <DashboardTasks />
      </DashboardItemContent>
    </TaskProvider>
  );
}
