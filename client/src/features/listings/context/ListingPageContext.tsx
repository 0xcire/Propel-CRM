import { createContext, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { ReactNode } from 'react';
import type { SetURLSearchParams } from 'react-router-dom';

type ListingProviderProps = {
  children: ReactNode;
};

type ListingState = {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
};

const listingContext = createContext<ListingState | undefined>(undefined);

export function ListingProvider({
  children,
}: ListingProviderProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = { searchParams, setSearchParams };
  return (
    <listingContext.Provider value={value}>{children}</listingContext.Provider>
  );
}

export function useListingContext(): ListingState {
  const context = useContext(listingContext);
  if (context === undefined) {
    throw new Error('useListingContext must be used within a TaskProvider');
  }

  return context;
}
