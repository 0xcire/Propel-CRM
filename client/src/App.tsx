import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import routes from './routes';

import '@/styles/globals.css';

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
