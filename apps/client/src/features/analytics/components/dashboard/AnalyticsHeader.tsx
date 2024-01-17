import { Typography } from '@/components/ui/typography';

import { QuarterSelection } from '../QuarterSelection';

import { getCurrentYear } from '@/utils';

export function AnalyticsHeader(): JSX.Element {
  return (
    <>
      <Typography
        variant='h4'
        className='line-clamp-1'
      >
        {getCurrentYear().toString()} Performance
      </Typography>
      <QuarterSelection />
    </>
  );
}
