import { useQuery } from '@tanstack/react-query';

import { getListToSaleRatio } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { ListToSaleRatioData } from '../types';

export const useListToSaleRatio = (
  userID: number
): UseQueryResult<ListToSaleRatioData, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const year = searchParams.get('year');

  return useQuery({
    queryKey: ['list-to-sale-ratio', { userID: userID, year: year }],
    queryFn: () => getListToSaleRatio(userID),
    select: (data) => data.ratios,
  });
};
