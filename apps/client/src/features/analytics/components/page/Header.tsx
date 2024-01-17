import { twMerge } from 'tailwind-merge';

import { Typography } from '@/components/ui/typography';

import { YearSelection } from './YearSelection';
import { QuarterSelection } from '../QuarterSelection';

export function AnalyticsPageHeader({
  className,
}: {
  className: string;
}): JSX.Element {
  return (
    <div
      className={twMerge(
        'flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-start',
        className
      )}
    >
      <Typography
        variant='h4'
        className='max-w-fit text-base font-normal lg:text-lg'
      >
        Showing Results for:
      </Typography>
      <div className='flex max-w-fit items-center gap-2'>
        <YearSelection />
        <QuarterSelection />
      </div>
    </div>
  );
}
