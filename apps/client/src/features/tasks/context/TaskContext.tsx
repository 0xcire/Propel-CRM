import { useState, createContext, useContext } from 'react';

import type { PropsWithChildren, Dispatch, SetStateAction } from 'react';

type TaskState = {
  completed: [boolean, Dispatch<SetStateAction<boolean>>];
  title: [string, Dispatch<SetStateAction<string>>];
  dropdownState: [boolean, Dispatch<SetStateAction<boolean>>];
};

type TaskProviderProps = PropsWithChildren;

const taskContext = createContext<TaskState | undefined>(undefined);

export function TaskProvider({ children }: TaskProviderProps): JSX.Element {
  const [showCompleted, setShowCompleted] = useState(false);
  const [pageTitle, setPageTitle] = useState('Tasks');
  const [open, setOpen] = useState(false);

  const value: TaskState = {
    completed: [showCompleted, setShowCompleted],
    title: [pageTitle, setPageTitle],
    dropdownState: [open, setOpen],
  };
  return <taskContext.Provider value={value}>{children}</taskContext.Provider>;
}

export function useTaskContext(): TaskState {
  const context = useContext(taskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }

  return context;
}
