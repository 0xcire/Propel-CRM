import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { type SubmitHandler } from 'react-hook-form';

import { useLogin } from '@/lib/react-query-auth';
import { useQueryClient } from '@tanstack/react-query';

import { Typography } from '@/components/ui/typography';

import { type SignInFields, AuthForm } from './AuthForm';

export function SignInForm(): JSX.Element {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const login = useLogin({
    onSuccess: () => {
      queryClient.invalidateQueries(['authenticated-user']);
      navigate('/protected');
    },
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const onSubmit: SubmitHandler<SignInFields> = useCallback(
    (values: SignInFields) => {
      login.mutate(values);
    },
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
      <Link
        to='/auth/signup'
        className='text-sm text-slate-900'
      >
        No account yet? Sign up here.
      </Link>
    </div>
  );
}
