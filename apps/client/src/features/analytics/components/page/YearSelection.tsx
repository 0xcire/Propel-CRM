import { useSearchParams } from 'react-router-dom';

import { useUser } from '@/lib/react-query-auth';
import { useSalesYears } from '../../hooks/useSalesYears';

import { Select } from '@/components/Select';
import { Spinner } from '@/components/Spinner';

import { getCurrentYear } from '@/utils';

import type { Years } from '../../types';

export function YearSelection(): JSX.Element | null {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useUser();
  const years = useSalesYears(user.data?.id as number);

  const currentYearString = getCurrentYear().toString();

  const yearsAvailable = !!(years.data?.length && years.data?.length > 0);

  const yearSelectionOptions = years.data?.includes(currentYearString)
    ? years.data
    : yearsAvailable
    ? [...(years.data as Years), currentYearString]
    : ['No available data.'];

  const onSelectChange = (val: string): void => {
    searchParams.set('year', val);
    setSearchParams(searchParams);
  };

  if (years.isInitialLoading) {
    return <Spinner variant='md' />;
  }

  return (
    <Select
      className='w-24'
      handleSelectChange={
        yearsAvailable ? (val): void => onSelectChange(val) : undefined
      }
      options={yearSelectionOptions}
      defaultValue={searchParams.get('year') || getCurrentYear().toString()}
    />
  );
}
