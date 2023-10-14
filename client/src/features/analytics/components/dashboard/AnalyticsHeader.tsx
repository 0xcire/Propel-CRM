import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';

import { Select } from '@/components/Select';
import { Typography } from '@/components/ui/typography';

import { quarters } from '../../config';

import type { Quarters } from '../../types';

export function AnalyticsHeader(): JSX.Element {
  const { setState: setCurrentTimeFrame } = useAnalyticsContext();

  const handleSelectChange = (val: string): void => {
    setCurrentTimeFrame(val as Quarters);
  };

  return (
    <>
      <Typography variant='h4'>YTD Performance</Typography>
      <Select
        placeholder='Filter by quarter'
        options={quarters}
        handleSelectChange={handleSelectChange}
      />
    </>
  );
}
