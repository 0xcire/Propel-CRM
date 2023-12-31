import { useState, createContext, useContext } from 'react';

import type { PropsWithChildren, Dispatch, SetStateAction } from 'react';
import type { Quarters } from '../types';

type TaskState = {
  state: Quarters;
  setState: Dispatch<SetStateAction<Quarters>>;
};

const analyticsContext = createContext<TaskState | undefined>(undefined);

export function AnalyticsProvider({
  children,
}: PropsWithChildren): JSX.Element {
  const [currentTimeFrame, setCurrentTimeFrame] = useState<Quarters>('year');

  const value = { state: currentTimeFrame, setState: setCurrentTimeFrame };
  return (
    <analyticsContext.Provider value={value}>
      {children}
    </analyticsContext.Provider>
  );
}

export function useAnalyticsContext(): TaskState {
  const context = useContext(analyticsContext);
  if (context === undefined) {
    throw new Error(
      'useAnalyticsContext must be used within a Analytics Provider'
    );
  }

  return context;
}
