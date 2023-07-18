import { Typography } from '@/components/ui/typography';
import { LinkButton } from '@/components';

const NotFound = (): JSX.Element => {
  return (
    <div className='grid h-screen w-full place-items-center'>
      <Typography variant='h3'>404! Can't find that page.</Typography>
      <LinkButton
        path='/'
        text='Go Home'
      />
    </div>
  );
};

export default NotFound;
