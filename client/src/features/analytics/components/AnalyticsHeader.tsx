import { Select } from '@/components/Select';
import { Typography } from '@/components/ui/typography';

import { useAnalyticsContext } from '@/features/analytics/context/AnalyticsContext';

const quarters = ['YTD', 'Q1', 'Q2', 'Q3', 'Q4'] as const;
export type Quarters = (typeof quarters)[number];

export function AnalyticsHeader(): JSX.Element {
  const { setState: setCurrentTimeFrame } = useAnalyticsContext();
  const handleSelectChange = (val: string): void => {
    setCurrentTimeFrame(val as Quarters);
  };

  return (
    <>
      <Typography variant='h4'>YTD Performance</Typography>
      <Select
        label='Filter by time frame'
        options={quarters}
        handleSelectChange={handleSelectChange}
      />
    </>
  );
}
