'use client';

import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore, RootState } from '@/shared/store';
import { HYDRATE } from '@/shared/store/slices';

interface StoreProviderProps {
  children: ReactNode;
  preloadedState: RootState;
}

export function StoreProvider({ children, preloadedState }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch({
      type: HYDRATE,
      payload: preloadedState
    });
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}