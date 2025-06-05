import { LOCAL_URL } from '@/shared/config';
import { Action, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const HYDRATE = `__NEXT_REDUX_WRAPPER_HYDRATE__` as const;

export interface Product {
  id: number;
  image_url: string;
  title: string;
  description: string;
  price: number;
}

export interface ProductsApiResponse {
  page: number;
  amount: number;
  total: number;
  items: Product[];
}


export interface FetchProductsParams {
  page: number;
  pageSize: number;
}

export interface ProductsState {
  items: Product[];
  page: number;
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  page: 1,
  total: 0,
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<
  ProductsApiResponse,
  FetchProductsParams,
  { rejectValue: string }
>(
  'products/fetchProducts',
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${LOCAL_URL}/products?page=${page}&page_size=${pageSize}`
      );
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      return await response.json() as ProductsApiResponse;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

interface HydrateAction extends Action<typeof HYDRATE> {
  payload: {
    products: ProductsState;
  };
}

const isHydrateAction = (action: Action): action is HydrateAction => {
  return action.type === HYDRATE;
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = [...state.items, ...action.payload.items];
        state.page = action.payload.page;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error';
      })
      .addMatcher(isHydrateAction, (state, action) => {
        return {
          ...state,
          ...action.payload.products
        };
      })
  }
});

export const productsReducer = productsSlice.reducer;