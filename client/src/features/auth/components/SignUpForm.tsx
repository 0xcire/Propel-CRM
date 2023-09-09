import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { type SubmitHandler, DeepPartial } from 'react-hook-form';

import { useRegister } from '@/lib/react-query-auth';

import { Typography } from '@/components/ui/typography';

import { AuthForm, type SignUpFields } from './AuthForm';

export function SignUpForm(): JSX.Element {
  const register = useRegister();
  const defaultValues: DeepPartial<SignUpFields> = {
    name: '',
    username: '',
    email: '',
    password: '',
  };

  const onSubmit: SubmitHandler<SignUpFields> = useCallback(
    (values: SignUpFields) => {
      register.mutate(values);
    },
    []
  );

  return (
    <>
      <div className='mx-auto w-3/4 max-w-[500px]'>
        <Typography variant='h1'>Sign Up</Typography>
        <AuthForm
          isCreate={true}
          isLoading={register.isLoading}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />

        <Link
          to='/auth/signin'
          className='text-sm text-slate-900'
        >
          Already have an account? Sign in here.
        </Link>
      </div>
    </>
  );
}
