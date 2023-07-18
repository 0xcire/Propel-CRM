import { useLogout, useUser } from '@/lib/react-query-auth';
import { queryClient } from '@/lib/react-query';
import { useNavigate } from 'react-router-dom';
import { SubmitButton } from './SubmitButton';
import { Typography } from './ui/typography';

const Protected = (): JSX.Element => {
  const user = useUser();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <>
      <Typography variant='h4'>welcome, {user.data?.name as string}</Typography>

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
    </>
  );
};

export default Protected;
