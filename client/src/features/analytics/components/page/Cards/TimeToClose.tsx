import { useUser } from '@/lib/react-query-auth';
import { useAvgTimeToClose } from '@/features/analytics/hooks/useAvgTimeToClose';

import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';

import { Spinner } from '@/components';
import { Typography } from '@/components/ui/typography';

import { twMerge } from 'tailwind-merge';

import { filterAnalyticsData } from '@/features/analytics/utils';

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

  const calculateAverage = (): string => {
    if (timeToClose.data && timeToClose.data.length > 0) {
      const filteredTimeToCloseData = filterAnalyticsData(
        timeToClose.data,
        currentTimeFrame
      ).filter((data) => +(data.days.split(' ')[0] as string) !== 0);

      if (filteredTimeToCloseData.length === 0) {
        return '0';
      }

      const average = Math.floor(
        filteredTimeToCloseData
          .map((data) => +(data.days.split(' ')[0] as string))
          .reduce((previous, current) => previous + current, 0) /
          filteredTimeToCloseData.length
      ).toString();

      return average;
    }

    return '0';
  };

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
          {calculateAverage()}
        </Typography>
      </div>
    </div>
  );
}
