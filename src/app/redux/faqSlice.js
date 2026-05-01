import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest, getRequest, postUpdate } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/faq-constant'



export const addProductFaq = createAsyncThunk(
  'faq/addProductFaq',
  async (faqData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_PRODUCT_FAQ, faqData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add Coupon'
      );
    }
  }
);

export const fetchProductFaq = createAsyncThunk(
  'faq/fetchProductFaq',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${API_ENDPOINTS.GET_ALL_FAQ_BY_PRODUCTID}?productId=${productId}`);
      if (!response) {
        throw new Error('Invalid Order Details data recieved');
      }

      return { data: response.data, productId };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching Order Details');
    }
  }
);

export const updateProductFaq = createAsyncThunk(
  'faq/updateProductFaq',
  async (faqData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_PRODUCT_FAQ, faqData);
      return response;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete product'
      );
    }
  }
);

export const deleteProductFaq = createAsyncThunk(
  'faq/deleteProductFaq',
  async (faqData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.DELETE_PRODUCT_FAQ, faqData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete FAQ');
    }
  }
);

const faqSlice = createSlice({
  name: 'faq',
  initialState: {
    faqData: [],
    faqProductId: [],
    currentProductId: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProductFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addProductFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.faqData = action.payload;
      })
      .addCase(addProductFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(fetchProductFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductFaq.fulfilled, (state, action) => {
        state.faqProductId = action.payload.data;
        state.currentProductId = action.payload.productId;
        state.loading = false;
      })
      .addCase(fetchProductFaq.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateProductFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductFaq.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.faqProductId = state.faqProductId.map(faq =>
          faq.productFaqid === updated.productFaqid ? updated : faq
        );
      })
      .addCase(updateProductFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProductFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.faqProductId = state.faqProductId.filter((faq) => faq.productFaqid !== action.payload);
      })
      .addCase(deleteProductFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });



  },
})

export default faqSlice.reducer