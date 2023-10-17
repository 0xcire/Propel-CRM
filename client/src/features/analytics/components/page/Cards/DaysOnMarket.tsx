import { useUser } from '@/lib/react-query-auth';
import { useAvgDaysOnMarket } from '@/features/analytics/hooks/useAvgDaysOnMarket';

import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';

import { Spinner } from '@/components';
import { Typography } from '@/components/ui/typography';

import { filterAnalyticsData } from '@/features/analytics/utils';

import type { DaysOnMarket } from '@/features/analytics/types';

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
      <div className='grid h-full w-full place-items-center'>
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
    );
  }

  const filteredTimeToCloseData = filterAnalyticsData(
    daysOnMarket.data as DaysOnMarket,
    currentTimeFrame
  ).filter((data) => +(data.average.split(' ')[0] as string) !== 0);

  const calculatedAverage =
    daysOnMarket.data && daysOnMarket.data.length > 0
      ? Math.floor(
          filteredTimeToCloseData
            .map((data) => +(data.average.split(' ')[0] as string))
            .reduce((previous, current) => previous + current, 0) /
            filteredTimeToCloseData.length
        ).toString()
      : 'no data yet';

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
          {calculatedAverage as string}
        </Typography>
      </div>
    </div>
  );
}
