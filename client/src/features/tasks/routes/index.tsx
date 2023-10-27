import { Suspense } from 'react';
import { lazyImport } from '@/utils/lazyImport';

import { TaskProvider } from '../context/TaskContext';

import { TaskLayout } from '../components/Layout';

import { TaskPageWrapper } from '@/features/listings/components/page/TaskPageWrapper';
const { TaskPage } = lazyImport(() => import('../components/page'), 'TaskPage');
const { TaskRoute } = lazyImport(
  () => import('../components/page/TaskRoute'),
  'TaskRoute'
);

const { ListingTaskPage } = lazyImport(
  () => import('../components/page/ListingTaskPage'),
  'ListingTaskPage'
);
const { ContactTaskPage } = lazyImport(
  () => import('../components/page/ContactTaskPage'),
  'ContactTaskPage'
);

import type { RouteObject } from 'react-router-dom';
// /tasks
// /tasks/:id
// /tasks/:projectID
// /tasks/:projectID/task/:taskID

// /tasks/:listingID/task/:taskID
// /tasks/:contactID/task/:taskID

// :categoryID -> task categories / listings / contacts?

export const taskRoutes: RouteObject = {
  path: 'tasks',

  element: (
    <TaskProvider>
      <TaskLayout />
    </TaskProvider>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense>
          <TaskPageWrapper>
            <TaskPage />
          </TaskPageWrapper>
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
    {
      path: 'listings/:id',
      element: (
        <Suspense>
          <TaskPageWrapper>
            <ListingTaskPage />
          </TaskPageWrapper>
        </Suspense>
      ),
    },
    {
      path: 'contacts/:id',
      element: (
        <Suspense>
          <TaskPageWrapper>
            <ContactTaskPage />
          </TaskPageWrapper>
        </Suspense>
      ),
    },
    // {
    //   path: ':categoryID',
    //   element: (
    //     <Suspense>

    //       <TaskCategoryRoute />
    //     </Suspense>
    //   ),
    // },
    // {
    //   path: ':id',
    //   element: (
    //     <Suspense>
    //       <TaskRoute />
    //     </Suspense>
    //   ),
    // },
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
