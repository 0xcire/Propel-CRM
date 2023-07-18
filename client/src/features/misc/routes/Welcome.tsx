import { LinkButton } from '@/components';
import { useUser } from '@/lib/react-query-auth';
// import { useNavigate } from 'react-router-dom';

function Welcome(): JSX.Element {
  const user = useUser();
  // const navigate = useNavigate();

  const redirectPath = (): string => {
    if (user.data) {
      // navigate('/protected');
      return '/protected';
    }
    return '/auth/signin';
  };
  return (
    <div className='grid h-screen w-full place-items-center'>
      <div className='space-y-2'>
        <h1 className='scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl'>
          Propel CRM
        </h1>
        <p>
          "Elevate Your Real Estate Success with Our Cutting-Edge CRM Solution."
        </p>
        <LinkButton
          text='Get Started'
          path={redirectPath()}
        />
      </div>
    </div>
  );
}

export default Welcome;
