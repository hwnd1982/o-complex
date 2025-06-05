import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { productsReducer } from './slices';

export const makeStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer
    }
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// import { configureStore } from '@reduxjs/toolkit'
// import { baseApi, reviewsApi } from '@/shared/api'
// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// export const makeStore = () => {
//   return configureStore({
//     reducer: {
//       [baseApi.reducerPath]: baseApi.reducer,
//       [reviewsApi.reducerPath]: reviewsApi.reducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware().concat(
//         baseApi.middleware,
//         reviewsApi.middleware
//       ),
//   })
// }

// export type AppStore = ReturnType<typeof makeStore>
// export type RootState = ReturnType<AppStore['getState']>
// export type AppDispatch = AppStore['dispatch']

// export const useAppDispatch: () => AppDispatch = useDispatch
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;