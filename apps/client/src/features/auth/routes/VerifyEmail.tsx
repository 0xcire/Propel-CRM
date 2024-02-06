import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useUser } from '@/lib/react-query-auth';
import { useVerifyEmail } from '../hooks/useVerifyEmail';

import { Typography } from '@/components/ui/typography';

import { Layout } from '../components/Layout';
import { LinkButton } from '@/components/LinkButton';
import { Spinner } from '@/components/Spinner';

export function VerifyEmail(): JSX.Element {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { mutate, isLoading } = useVerifyEmail();

  // StrictMode actually introduces unexpected behavior
  // 1st run, token is invalidated and returns 200 / success msg
  // 2nd run, now the token is invalid, resulting in an error which overrides previous success toast
  // [ ]: could potentially use navigate(path, { state: ??? }) and show toast based off that state instead?

  const isApiCalled = useRef(false);
  useEffect(() => {
    if (token && !isApiCalled.current) {
      mutate(token);
    }
    isApiCalled.current = true;
    //eslint-disable-next-line
  }, []);

  return (
    <Layout title='Verify Email | Propel CRM'>
      <div>
        {isLoading && !isApiCalled.current ? (
          <Spinner variant='md' />
        ) : (
          <>
            <Typography variant='h3'>Request Expired</Typography>
            <p className='text-sm'>
              Check your email for the full link or sign in and make a new
              request.
            </p>
            <ReturnToSession />
          </>
        )}
      </div>
    </Layout>
  );
}

function ReturnToSession(): JSX.Element {
  const user = useUser();

  return (
    <>
      {user.data === null ? (
        <div>
          <LinkButton
            className='mt-2 px-0'
            variant='link'
            path='/auth/signin'
          >
            Back to Sign in
          </LinkButton>
        </div>
      ) : (
        <div>
          <LinkButton
            className='mt-2 px-0'
            variant='link'
            path='/dashboard'
          >
            Back to home
          </LinkButton>
        </div>
      )}
    </>
  );
}
