// TODO: obviously this should be refactored into <Dashboard /> once everything is built out

import { useNavigate } from 'react-router-dom';

import { useLogout, useUser } from '@/lib/react-query-auth';
import { queryClient } from '@/lib/react-query';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import { SubmitButton } from './SubmitButton';

import { AddContact } from '@/features/contacts/components/AddContact';
import { ContactList } from '@/features/contacts/components/ContactList';
import { TaskList } from '@/features/tasks/components/TaskList';

import { TaskDropdown } from '@/features/tasks/components/TaskDropdown';
import { TaskProvider } from '@/features/tasks/context/TaskContext';

const Protected = (): JSX.Element => {
  const user = useUser();
  const logout = useLogout();
  const navigate = useNavigate();

  useDocumentTitle('Dashboard | Propel CRM');

  if (!user) {
    navigate('/auth/signin');
  }

  return (
    <>
      <div className='flex h-full w-full flex-1 flex-col'>
        <div className='flex w-full items-center justify-between px-12 pt-10'>
          <Typography variant='h3'>
            Welcome, {user.data?.name as string}
          </Typography>
          <Button className='mr-4'>Add</Button>
        </div>
        <div className='grid h-full max-h-screen flex-1 grid-cols-12 grid-rows-6 gap-4 p-12 pb-10 xl:flex-1'>
          <div className='col-start-1 col-end-10 row-start-1 row-end-4 grid place-items-center rounded border shadow 2xl:col-end-11'>
            <div>
              <p>Listings...</p>
              <div>
                <SubmitButton
                  text='Logout'
                  isLoading={logout.isLoading}
                  onClick={(): void =>
                    logout.mutate(
                      {},
                      {
                        onSuccess: () => {
                          queryClient.invalidateQueries(['authenticated-user']);
                          queryClient.clear();
                          navigate('/');
                        },
                      }
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className='relative col-start-10 col-end-13 row-start-1 row-end-7 rounded border shadow 2xl:col-start-11'>
            <div className='flex h-[60px] items-center justify-between px-4'>
              <Typography variant='h4'>Contacts</Typography>
              <AddContact />
            </div>
            <div className='absolute h-[calc(100%-60px)] w-full'>
              <ContactList />
            </div>
          </div>
          <div className='relative col-start-1 col-end-4 row-start-4 row-end-7 rounded border shadow'>
            <TaskProvider>
              <div className='flex h-[60px] items-center justify-between px-4'>
                <Typography variant='h4'>Tasks</Typography>

                <TaskDropdown />
              </div>
              <div className='absolute h-[calc(100%-60px)] w-full'>
                <TaskList />
              </div>
            </TaskProvider>
          </div>
          <div className='col-start-4 col-end-10 row-start-4 row-end-7 rounded border shadow 2xl:col-end-11'>
            <p>analytics</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Protected;
