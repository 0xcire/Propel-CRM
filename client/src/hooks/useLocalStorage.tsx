// ref: https://react.dev/reference/react/useSyncExternalStore#subscribing-to-a-browser-api

// TODO: reimplement ui.dev hook to learn about useSyncExternalStore

// import { useEffect, useSyncExternalStore } from 'react';

// import type { Dispatch, SetStateAction } from 'react';

// const dispatchStorageEvent = (key, newValue) => {};

// const subscribe = (callback: () => unknown): (() => void) => {
//   window.addEventListener('storage', callback);
//   return () => {
//     window.removeEventListener('storage', callback);
//   };
// };

// export const useLocalKV = (
//   key: string,
//   initialValue: string | undefined
// ): [string | null, Dispatch<SetStateAction<string | null>>] => {
//   const snapshot = (): string | null => localStorage.getItem(key);

//   const store = useSyncExternalStore(subscribe, snapshot);
// };

export const useLocalStorage = (): void => {
  return;
};
