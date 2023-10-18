import { useSearchParams } from 'react-router-dom';

import { useAnalyticsContext } from '../../context/AnalyticsContext';

import { Typography } from '@/components/ui/typography';

import { YearSelection } from './YearSelection';
import { QuarterSelection } from '../QuarterSelection';

export function AnalyticsPageHeader({
  className,
}: {
  className: string;
}): JSX.Element {
  const [searchParams] = useSearchParams();

  const { state: currentTimeFrame } = useAnalyticsContext();

  return (
    <div className={className}>
      <Typography variant='h4'>
        {`Showing Results for ${searchParams.get('year')}`}
        {currentTimeFrame !== 'year' ? `, ${currentTimeFrame}` : ''}
      </Typography>
      <div className='flex items-center gap-2'>
        <YearSelection />
        <QuarterSelection />
      </div>
    </div>
  );
}
