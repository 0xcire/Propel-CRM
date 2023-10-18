import { useUser } from '@/lib/react-query-auth';
import { useAvgDaysOnMarket } from '@/features/analytics/hooks/useAvgDaysOnMarket';

import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';

import { Spinner } from '@/components';
import { Typography } from '@/components/ui/typography';

import { twMerge } from 'tailwind-merge';
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
      <div
        className={twMerge('grid h-full w-full place-items-center', className)}
      >
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
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
          className='text-2xl font-black'
        >
          {average}
        </Typography>
      </div>
    </div>
  );
}
