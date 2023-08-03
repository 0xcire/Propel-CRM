import { useNavigate } from 'react-router-dom';

import { useLogout, useUser } from '@/lib/react-query-auth';
import { queryClient } from '@/lib/react-query';

import { Typography } from './ui/typography';
import { SubmitButton } from './SubmitButton';
import { Button } from './ui/button';
import { AddContact } from '@/features/contacts/components/AddContact';
import { ContactList } from '@/features/contacts/components/ContactList';

const Protected = (): JSX.Element => {
  const user = useUser();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <>
      <div className='flex h-full w-full flex-col py-10'>
        <div className='flex w-full items-center justify-between px-12'>
          <Typography variant='h3'>
            Welcome, {user.data?.name as string}
          </Typography>
          <Button>Add</Button>
        </div>
        <div className='grid h-full grid-cols-12 grid-rows-6 gap-4 p-12 pb-0 xl:flex-1'>
          <div
            className='col-start-1 col-end-10 row-start-1 row-end-4 grid place-items-center rounded border
          border-black'
          >
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
                          navigate('/');
                        },
                      }
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div className='col-start-10 col-end-13 row-start-1 row-end-7 rounded border border-black'>
            <div className='flex items-center justify-between p-4'>
              <span>contacts</span>
              <AddContact />
            </div>
            <ContactList />
          </div>
          <div className='col-start-1 col-end-4 row-start-4 row-end-7 rounded border border-black'>
            tasks
          </div>
          <div className='col-start-4 col-end-10 row-start-4 row-end-7 rounded border border-black'>
            analytics
          </div>
        </div>
      </div>
    </>
  );
};

export default Protected;
