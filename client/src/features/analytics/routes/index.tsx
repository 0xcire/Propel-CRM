import { Suspense } from 'react';

import { lazyImport } from '@/utils/lazyImport';

import { AnalyticsLayout } from '@/features/analytics/components/Layout';

const { AnalyticsPage } = lazyImport(
  () => import('../components/page'),
  'AnalyticsPage'
);

const { AnalyticsRoute } = lazyImport(
  () => import('../components/page/AnalyticsRoute'),
  'AnalyticsRoute'
);

import type { RouteObject } from 'react-router-dom';

export const analyticsRoutes: RouteObject = {
  path: 'analytics',
  element: <AnalyticsLayout />,
  children: [
    {
      index: true,
      element: (
        <Suspense>
          <AnalyticsPage />
        </Suspense>
      ),
    },
    {
      path: ':id',
      element: (
        <Suspense>
          <AnalyticsRoute />
        </Suspense>
      ),
    },
  ],
};
