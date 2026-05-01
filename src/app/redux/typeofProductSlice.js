import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postCreate, postRequest, postUpdate } from '@/app/pages/api/auth';
import { API_ENDPOINTS } from '@/app/constants/typeOfProduct-constant';

// Fetch Product Types
export const fetchTypeOfProduct = createAsyncThunk(
  'typeofproduct/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_TYPE_OF_PRODUCT);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching types of product');
    }
  }
);

// Add TypeOfProduct
export const addTypeOfProduct = createAsyncThunk(
  'typeofproduct/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postCreate(API_ENDPOINTS.ADD_TYPE_OF_PRODUCT, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding type of product');
    }
  }
);

// Update TypeOfProduct
export const updateTypeOfProduct = createAsyncThunk(
  'typeofproduct/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_TYPE_OF_PRODUCT, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating type of product');
    }
  }
);

// Delete TypeOfProduct
export const deleteTypeOfProduct = createAsyncThunk(
  'typeofproduct/delete',
  async ({ typeofProductId }, { rejectWithValue }) => {
    try {
      const data = { typeofProductId };
      const response = await postRequest(API_ENDPOINTS.DELETE_TYPE_OF_PRODUCT, data);
      if (!response?.data) {
        return { statusCode: 200, message: 'Type of Product deleted successfully.' };
      }
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Error deleting type of product' });
    }
  }
);

export const fetchActiveTypeOfProductList = createAsyncThunk(
  'typeofproduct/fetchActiveTypeOfProductList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_TYPE_OF_ACTIVE_PRODUCT);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
      );
    }
  }
);

// Slice
const typeofProductSlice = createSlice({
  name: 'typeofproduct',
  initialState: {
    typeofproduct: [],
    typeofproductList: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

.addCase(fetchActiveTypeOfProductList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveTypeOfProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.typeofproductList = action.payload;
      })
      .addCase(fetchActiveTypeOfProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTypeOfProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypeOfProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.typeofproduct = action.payload;
      })
      .addCase(fetchTypeOfProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTypeOfProduct.fulfilled, (state, action) => {
        state.typeofproduct.push(action.payload.data);
      })
      .addCase(addTypeOfProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTypeOfProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        if (!updatedProduct || !updatedProduct.typeofProductId) return;
        const index = state.typeofproduct.findIndex(
          (item) => item.typeofProductId === updatedProduct.typeofProductId
        );
        if (index !== -1) state.typeofproduct[index] = updatedProduct;
      })
      .addCase(updateTypeOfProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTypeOfProduct.fulfilled, (state, action) => {
        state.typeofproduct = state.typeofproduct.filter(
          (item) => item.typeofProductId !== action.payload
        );
      })
      .addCase(deleteTypeOfProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default typeofProductSlice.reducer;
