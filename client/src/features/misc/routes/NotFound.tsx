import { LinkButton } from '@/components';

const NotFound = (): JSX.Element => {
  return (
    <div className='grid h-screen w-full place-items-center'>
      <h3>404! Cant find that page.</h3>
      <LinkButton
        path='/'
        text='Go Home'
      />
    </div>
  );
};

export default NotFound;
