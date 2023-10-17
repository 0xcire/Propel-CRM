import { useUser } from '@/lib/react-query-auth';
import { useListToSaleRatio } from '@/features/analytics/hooks/useListToSaleRatio';

import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';
import { Spinner } from '@/components';
import { Typography } from '@/components/ui/typography';

import { twMerge } from 'tailwind-merge';

import { filterAnalyticsData } from '@/features/analytics/utils';

import type { ListToSaleRatio } from '@/features/analytics/types';

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

  const calculatedAverage = (): string => {
    const filteredListToSaleData = filterAnalyticsData(
      listToSaleRatio.data as ListToSaleRatio,
      currentTimeFrame
    ).filter((data) => +data.ratio !== 0);

    if (listToSaleRatio.data && listToSaleRatio.data.length > 0) {
      return (
        Math.floor(
          (filteredListToSaleData
            .map((data) => +data.ratio)
            .reduce((previous, current) => previous + current, 0) /
            filteredListToSaleData.length) *
            100
        ).toString() + '%'
      );
    }

    if (filteredListToSaleData.length === 0) {
      return '0%';
    }

    return '0%';
  };

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
          {calculatedAverage() as string}
        </Typography>
      </div>
    </div>
  );
}
