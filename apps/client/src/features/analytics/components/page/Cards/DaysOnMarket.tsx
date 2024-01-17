import { useUser } from '@/lib/react-query-auth';
import { useAvgDaysOnMarket } from '@/features/analytics/hooks/useAvgDaysOnMarket';

import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';

import { Spinner } from '@/components/Spinner';
import { Typography } from '@/components/ui/typography';

import { calculateAverage } from '@/features/analytics/utils';

import type { AnalyticsDataPoint } from '@/features/analytics/types';

export function DaysOnMarketCard({
  className,
}: {
  className: string;
}): JSX.Element {
  const user = useUser();
  const daysOnMarket = useAvgDaysOnMarket(user.data?.id as number);

  const { state: currentTimeFrame } = useAnalyticsContext();

  if (daysOnMarket.isLoading) {
    return (
      <Spinner
        className={className}
        variant='md'
        fillContainer
      />
    );
  }

  const average = calculateAverage({
    data: daysOnMarket.data,
    getValues: (data) =>
      +((data as AnalyticsDataPoint).value.split(' ')[0] as string),
    currentTimeFrame: currentTimeFrame,
  });

  return (
    <div className={className}>
      <div>
        <Typography
          variant='h4'
          className='text-base font-normal'
        >
          Avg Days On Market
        </Typography>
        <Typography
          variant='p'
          className='text-xl font-black lg:text-2xl'
        >
          {average}
        </Typography>
      </div>
    </div>
  );
}
