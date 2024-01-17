import { useAnalyticsContext } from '../context/AnalyticsContext';

import { Select } from '@/components/Select';

import { quarters } from '../config';

import type { Quarters } from '../types';

export function QuarterSelection(): JSX.Element {
  const { setState: setCurrentTimeFrame } = useAnalyticsContext();

  const handleSelectChange = (val: string): void => {
    setCurrentTimeFrame(val as Quarters);
  };

  return (
    <Select
      className='w-24'
      defaultValue='year'
      options={quarters}
      handleSelectChange={(val): void => handleSelectChange(val)}
    />
  );
}
