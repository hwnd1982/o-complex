import { Action, configureStore, Dispatch, Middleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { productsReducer, cartReducer, CartState } from './slices';

interface CartStateForMiddleware {
  cart: CartState
}

function rehydrateStore() {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return null;
}

const localStorageMiddleware: Middleware<
  unknown, 
  CartStateForMiddleware,
  Dispatch<Action>
> = (store) => (next) => (action) => {
  const result = next(action);
  
  if (typeof window !== 'undefined') {
    const state = store.getState();
    localStorage.setItem('cart', JSON.stringify(state.cart.items));
  }
  
  return result;
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      products: productsReducer
    },
    preloadedState: {
      cart: {
        items: rehydrateStore(),
      }
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;