import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useRegister } from '@/lib/react-query-auth';

import { Typography } from '@/components/ui/typography';
import { AuthForm } from './AuthForm';

import type { DeepPartial } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { SignUpFields } from './AuthForm';

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

    // eslint-disable-next-line
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
          className='text-sm text-muted-foreground'
        >
          Already have an account? Sign in here.
        </Link>
      </div>
    </>
  );
}
