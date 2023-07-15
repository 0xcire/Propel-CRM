import { useLogout, useUser } from '@/lib/react-query-auth';
import { Button } from './ui/button';
import { queryClient } from '@/lib/react-query';
import { redirect } from 'react-router-dom';

const Protected = (): JSX.Element => {
  const user = useUser();
  const logout = useLogout();

  return (
    <>
      <h1>welcome, {user.data?.name}</h1>
      <Button
        disabled={logout.isLoading}
        onClick={(): void =>
          logout.mutate(
            {},
            {
              onSuccess: () => {
                queryClient.invalidateQueries(['authenticated-user']);
                return redirect('/');
              },
            }
          )
        }
      >
        Logout
      </Button>
    </>
  );
};

export default Protected;
