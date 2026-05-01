import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest, getRequest, postUpdate } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/skinInsight-constant'

export const addSkinInsightProduct = createAsyncThunk(
  'skinInsight/addSkinInsightProduct',
  async (skinInsightProductData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_SKIN_INSIGHT_PRODUCT, skinInsightProductData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add Coupon'
      );
    }
  }
);

export const fetchSkinInsightProduct = createAsyncThunk(
  'skinInsight/fetchSkinInsightProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${API_ENDPOINTS.GET_ALL_SKIN_INSIGHT_PRODUCT_BY_PRODUCTID}?productId=${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add Coupon'
      );
    }
  }
);

export const updateProductSkinInsight = createAsyncThunk(
  'skinInsight/updateProductSkinInsight',
  async (skinInsightProductData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_SKIN_INSIGHT_PRODUCT, skinInsightProductData);
      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete product'
      );
    }
  }
);

export const deleteProductSkinInsight = createAsyncThunk(
  'skinInsight/deleteProductSkinInsight',
  async (skinInsightProductData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.DELETE_SKIN_INSIGHT_PRODUCT, skinInsightProductData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete FAQ');
    }
  }
);


const skinInsightProductSlice = createSlice({
  name: 'skinInsight',
  initialState: {
    skinInsightProductData: [],
    skinProductId: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSkinInsightProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addSkinInsightProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProductData = action.payload;
      })
      .addCase(addSkinInsightProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(fetchSkinInsightProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkinInsightProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.skinProductId = action.payload;
      })
      .addCase(fetchSkinInsightProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductSkinInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductSkinInsight.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated) {
          state.skinProductId = state.skinProductId.map(skinInsight =>
            skinInsight.skininsightproductId === updated.skininsightproductId ? updated : skinInsight
          );
        } 
      })

      .addCase(updateProductSkinInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProductSkinInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductSkinInsight.fulfilled, (state, action) => {
        state.loading = false;
        state.skinProductId = state.skinProductId.filter((skinInsight) => skinInsight.skininsightproductId !== action.payload);
      })
      .addCase(deleteProductSkinInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
})

export default skinInsightProductSlice.reducer