import { useUser } from '@/lib/react-query-auth';
import { useSalesVolume } from '@/features/analytics/hooks/useSalesVolume';

import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';

import { Spinner } from '@/components/Spinner';
import { Typography } from '@/components/ui/typography';

import { filterAnalyticsData } from '@/features/analytics/utils';

import { currency } from '@/utils/intl';

import type { SalesVolumes } from '@/features/analytics/types';

export function TotalVolumeCard({
  className,
}: {
  className: string;
}): JSX.Element {
  const user = useUser();
  const salesVolume = useSalesVolume(user.data?.id as number);

  const { state: currentTimeFrame } = useAnalyticsContext();

  if (salesVolume.isInitialLoading) {
    return (
      <Spinner
        className={className}
        variant='md'
        fillContainer
      />
    );
  }

  const filteredSalesVolumeData = salesVolume.data
    ? filterAnalyticsData(salesVolume.data as SalesVolumes, currentTimeFrame)
    : [];

  const salesVolumeTotal = filteredSalesVolumeData.reduce(
    (acc, { value: currentVolume }) => acc + +currentVolume,
    0
  );

  return (
    <div className={className}>
      <div>
        <Typography
          variant='h4'
          className='text-base font-normal'
        >
          Total Volume
        </Typography>
        <Typography
          variant='p'
          className='text-2xl font-black'
        >
          {currency.format(salesVolumeTotal)}
        </Typography>
      </div>
    </div>
  );
}
