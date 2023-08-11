import {
  useState,
  createContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useContext,
} from 'react';

// TODO: another place where ComponentWithChild could be used
type TaskProviderProps = {
  children: ReactNode;
};

type TaskState = {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
};

const taskContext = createContext<TaskState | undefined>(undefined);

export function TaskProvider({ children }: TaskProviderProps): JSX.Element {
  const [showCompleted, setShowCompleted] = useState(false);

  const value = { state: showCompleted, setState: setShowCompleted };
  return <taskContext.Provider value={value}>{children}</taskContext.Provider>;
}

export function useTaskContext(): TaskState {
  const context = useContext(taskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }

  return context;
}
