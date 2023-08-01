import { useLocation, useNavigate } from 'react-router-dom';

import { useLogout, useUser } from '@/lib/react-query-auth';
import { queryClient } from '@/lib/react-query';

import { Typography } from './ui/typography';
import { SubmitButton } from './SubmitButton';

const Protected = (): JSX.Element => {
  const user = useUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  return (
    <>
      <div className='grid h-full w-full place-items-center xl:flex-1'>
        <div>
          {user.data && (
            <>
              <Typography variant='h4'>welcome, {user.data.name}</Typography>
              <Typography variant='p'>{user.data.username}</Typography>
            </>
          )}
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
    </>
  );
};

export default Protected;
