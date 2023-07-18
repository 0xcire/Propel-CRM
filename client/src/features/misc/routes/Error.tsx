import { Typography } from '@/components/ui/typography';
import { LinkButton } from '@/components';

const Error = (): JSX.Element => {
  return (
    <div className='grid h-screen w-full place-items-center'>
      <Typography variant='h3'>Uh Oh! Something went wrong.</Typography>
      <LinkButton
        path='/'
        text='Go Home'
      />
    </div>
  );
};

export default Error;
