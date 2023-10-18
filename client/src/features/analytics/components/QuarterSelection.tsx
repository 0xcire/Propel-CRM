import { useAnalyticsContext } from '../context/AnalyticsContext';

import { Select } from '@/components';

import { quarters } from '../config';

import type { Quarters } from '../types';

export function QuarterSelection(): JSX.Element {
  const { setState: setCurrentTimeFrame } = useAnalyticsContext();

  const handleSelectChange = (val: string): void => {
    setCurrentTimeFrame(val as Quarters);
  };
  return (
    <Select
      placeholder='Filter by quarter'
      options={quarters}
      handleSelectChange={(val): void => handleSelectChange(val)}
      className='w-full'
    />
  );
}
