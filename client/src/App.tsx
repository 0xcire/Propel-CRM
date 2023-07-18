import AppProvider from '@/providers/app';
import { Toaster } from '@/components/ui/toaster';

import '@/styles/globals.css';
import { Routes } from '@/routes';

function App(): JSX.Element {
  return (
    <>
      <AppProvider>
        <Routes />
        <Toaster />
      </AppProvider>
    </>
  );
}

export default App;
