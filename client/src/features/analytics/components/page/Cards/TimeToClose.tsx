import { useUser } from '@/lib/react-query-auth';
import { useAvgTimeToClose } from '@/features/analytics/hooks/useAvgTimeToClose';

import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';

import { Spinner } from '@/components';
import { Typography } from '@/components/ui/typography';

import { filterAnalyticsData } from '@/features/analytics/utils';

import type { TimeToClose } from '@/features/analytics/types';

export function TimeToCloseCard({
  className,
}: {
  className: string;
}): JSX.Element {
  const user = useUser();
  const timeToClose = useAvgTimeToClose(user.data?.id as number);

  const { state: currentTimeFrame } = useAnalyticsContext();

  if (timeToClose.isLoading) {
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
    timeToClose.data as TimeToClose,
    currentTimeFrame
  ).filter((data) => +(data.days.split(' ')[0] as string) !== 0);

  const calculatedAverage =
    timeToClose.data && timeToClose.data.length > 0
      ? Math.floor(
          filteredTimeToCloseData
            .map((data) => +(data.days.split(' ')[0] as string))
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
          Avg Days To Close
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
