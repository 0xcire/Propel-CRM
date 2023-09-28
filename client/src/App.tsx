import AppProvider from '@/providers/app';
import { Routes } from '@/routes';

import { Toaster } from '@/components/ui/toaster';

import '@/styles/globals.css';

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
