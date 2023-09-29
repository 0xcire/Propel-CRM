import { Suspense } from 'react';
import { lazyImport } from '@/utils/lazyImport';

import { TaskLayout } from '../components/Layout';

const { TaskPage } = lazyImport(() => import('../components/page'), 'TaskPage');
const { TaskRoute } = lazyImport(
  () => import('../components/page/TaskRoute'),
  'TaskRoute'
);

import type { RouteObject } from 'react-router-dom';

// ?
// /tasks
// /tasks/:id
// /tasks/:projectID
// /tasks/:projectID/task/:taskID

// OR

// /tasks?project=all/:id

export const taskRoutes: RouteObject = {
  path: 'tasks',
  element: <TaskLayout />,
  children: [
    {
      index: true,
      element: (
        <Suspense>
          <TaskPage />
        </Suspense>
      ),
    },
    {
      path: ':id',
      element: (
        <Suspense>
          <TaskRoute />
        </Suspense>
      ),
    },
    // {
    //   path: ':id/update',
    // },
    // {
    //   path: ':id/delete',
    // },
    // {
    //   path: ':id/update',
    // },
  ],
};
