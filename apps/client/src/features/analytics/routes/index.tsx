import { Suspense } from 'react';

import { lazyImport } from '@/utils/lazyImport';

const { AnalyticsLayout } = lazyImport(
  () => import('@/features/analytics/components/Layout'),
  'AnalyticsLayout'
);

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
  element: (
    <Suspense>
      <AnalyticsLayout />
    </Suspense>
  ),
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
