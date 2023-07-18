import { LinkButton } from '@/components';

const Error = (): JSX.Element => {
  return (
    <div className='grid h-screen w-full place-items-center'>
      <h3>Uh Oh! Something went wrong.</h3>
      <LinkButton
        path='/'
        text='Go Home'
      />
    </div>
  );
};

export default Error;
