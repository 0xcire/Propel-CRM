import { useUser } from '@/lib/react-query-auth';
import { useListToSaleRatio } from '@/features/analytics/hooks/useListToSaleRatio';

import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';
import { Spinner } from '@/components';
import { Typography } from '@/components/ui/typography';

import { twMerge } from 'tailwind-merge';
import { calculateAverage } from '@/features/analytics/utils';

import type { AnalyticsDataPoint } from '@/features/analytics/types';

export function ListToSaleRatioCard({
  className,
}: {
  className: string;
}): JSX.Element {
  const user = useUser();
  const listToSaleRatio = useListToSaleRatio(user.data?.id as number);

  const { state: currentTimeFrame } = useAnalyticsContext();

  if (listToSaleRatio.isLoading) {
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
    data: listToSaleRatio.data,
    getValues: (data) => +(data as AnalyticsDataPoint).value,
    currentTimeFrame: currentTimeFrame,
    percentage: true,
  });

  return (
    <div className={className}>
      <div>
        <Typography
          variant='h4'
          className='text-base font-normal'
        >
          Avg List To Sale Ratio
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
