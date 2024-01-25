import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useVerifyEmail } from '../hooks/useVerifyEmail';

import { Typography } from '@/components/ui/typography';

import { Layout } from '../components/Layout';
import { LinkButton } from '@/components/LinkButton';
import { useUser } from '@/lib/react-query-auth';

export function VerifyEmail(): JSX.Element {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const user = useUser();

  const { isVerified, error } = useVerifyEmail(token);

  useEffect(() => {
    if (isVerified) {
      if (user.data === null) {
        navigate('/auth/signin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isVerified, navigate, user.data]);

  return (
    <Layout title='Verify Email | Propel CRM'>
      <div>
        {(!token || !isVerified || error) && (
          <>
            <Typography variant='h3'>Request Expired</Typography>
            <p className='text-sm'>
              Check your email for the full link or sign in and make a new
              request.
            </p>
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
        )}
      </div>
    </Layout>
  );
}
