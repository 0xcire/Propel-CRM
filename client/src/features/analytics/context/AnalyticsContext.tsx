import type { Quarters } from '../components/AnalyticsHeader';
import {
  useState,
  createContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useContext,
} from 'react';

// TODO: another place where ComponentWithChild could be used
type AnalyticsProviderProps = {
  children: ReactNode;
};

type TaskState = {
  state: Quarters;
  setState: Dispatch<SetStateAction<Quarters>>;
};

const analyticsContext = createContext<TaskState | undefined>(undefined);

export function AnalyticsProvider({
  children,
}: AnalyticsProviderProps): JSX.Element {
  const [currentTimeFrame, setCurrentTimeFrame] = useState<Quarters>('YTD');

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
