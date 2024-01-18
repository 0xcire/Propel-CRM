import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { type SubmitHandler } from 'react-hook-form';

import { useLogin } from '@/lib/react-query-auth';

import { Typography } from '@/components/ui/typography';

import { type SignInFields, AuthForm } from './AuthForm';

export function SignInForm(): JSX.Element {
  const login = useLogin();

  const defaultValues = {
    email: '',
    password: '',
  };

  const onSubmit: SubmitHandler<SignInFields> = useCallback(
    (values: SignInFields) => {
      login.mutate(values);
    },

    // eslint-disable-next-line
    []
  );

  return (
    <div className='mx-auto w-3/4 max-w-[500px]'>
      <Typography variant='h1'>Sign In</Typography>
      <AuthForm
        isCreate={false}
        isLoading={login.isLoading}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />
      <div className='mt-2 flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center'>
        <Link
          to='/auth/signup'
          className='text-sm text-muted-foreground'
        >
          No account yet? Sign up here.
        </Link>
        <Link
          to='/auth/recovery'
          className='text-sm text-muted-foreground'
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
