import { Typography } from '@/components/ui/typography';
import { LinkButton } from '@/components';

export const NotFound = (): JSX.Element => {
  return (
    <div className='grid h-screen w-full place-items-center'>
      <div>
        <div className='flex items-center'>
          <Typography variant='h3'>404!</Typography>
          <div className='ml-4 mr-4 h-8 w-[1px] border border-black'></div>
          <Typography
            className='text-slate-700 [&:not(:first-child)]:mt-0'
            variant='p'
          >
            Can't find that page.
          </Typography>
        </div>
        <LinkButton
          delta={-1}
          text='Go Back'
          className='mt-3'
        />
      </div>
    </div>
  );
};
