// dashboard
// profile
// listings
// contacts
// tasks
// analytics

import { RouteObject } from 'react-router-dom';
import Protected from '@/components/Protected';

export const privateRoutes: Array<RouteObject> = [
  { path: '/', element: <Protected /> },
];
