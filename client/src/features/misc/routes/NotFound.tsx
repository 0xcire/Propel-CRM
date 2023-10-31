import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/lib/react-query-auth';

import { Typography } from '@/components/ui/typography';
import { LinkButton } from '@/components';

export const NotFound = (): JSX.Element => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.data) {
      navigate('/auth/signin');
    }

    // eslint-disable-next-line
  }, []);

  return (
    <div className='grid h-screen w-full place-items-center'>
      <div>
        <div className='flex items-center'>
          <Typography variant='h3'>404!</Typography>
          <div className='ml-4 mr-4 h-8 w-[1px] border border-black'></div>
          <Typography
            className='text-slate-700'
            variant='p'
          >
            Can't find that page.
          </Typography>
        </div>
        <LinkButton
          delta={-1}
          className='mt-3'
        >
          Go Back
        </LinkButton>
      </div>
    </div>
  );
};
