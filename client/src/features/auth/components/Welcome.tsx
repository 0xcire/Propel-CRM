import { LinkButton } from '@/components';

export function Welcome(): JSX.Element {
  return (
    <div className='p-4 md:p-0'>
      <h1 className='scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl'>
        Propel CRM
      </h1>
      <p>
        "Elevate Your Real Estate Success with Our Cutting-Edge CRM Solution."
      </p>
      <div className='flex'>
        <LinkButton
          className='m-1 ml-0 w-1/3'
          text='Sign In'
          path='/auth/signin'
        />
        <LinkButton
          className='m-1 ml-0 w-1/3'
          text='Sign Up'
          path='/auth/signup'
        />
        <LinkButton
          className='m-1 ml-0 w-1/3'
          text='View Demo'
          path='/auth/signin'
        />
      </div>
    </div>
  );
}
