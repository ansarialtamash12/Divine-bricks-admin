import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {getRequest,postCreate,postRequest,postUpdate,} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/size-constant'

// Fetch Sizes (GET Request)
export const fetchSizes = createAsyncThunk(
  'size/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_SIZE)
      if (!response || !response.data) {
        throw new Error('Invalid size data received')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching sizes')
    }
  },
)

// Add size (Post Create)
export const addSize = createAsyncThunk(
  'size/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postCreate(API_ENDPOINTS.ADD_SIZE, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding size')
    }
  },
)

// Update size (Post Update)
export const updateSize = createAsyncThunk(
  'size/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_SIZE, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating size')
    }
  },
)

// Delete size (Post Delete)
export const deleteSize = createAsyncThunk(
  'size/delete',
  async ({ sizeId }, { rejectWithValue }) => {
    try {
      const data = { sizeId }
      const response = await postRequest(API_ENDPOINTS.DELETE_SIZE, data)
      return {...response,sizeId}
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting size')
    }
  },
);

export const fetchActiveSizeList = createAsyncThunk(
    'brand/fetchActiveSizeList',
    async (_, { rejectWithValue }) => {
      try {
        const response = await getRequest(API_ENDPOINTS.GET_ALL_SIZE_FOR_USER);
        return response.data;
        
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
        );
      }
    }
  );

// Create Slice
const sizeSlice = createSlice({
  name: 'size',
  initialState: {
    sizes: [],
    loading: false,
    error: null,
    sizeData:[],
  },
  reducers: {},
  extraReducers: (builder) => {

    builder
                          .addCase(fetchActiveSizeList.pending, (state) => {
                            state.loading = true;
                            state.error = null;
                          })
                          .addCase(fetchActiveSizeList.fulfilled, (state, action) => {
                            state.loading = false;
                            state.sizeData = action.payload;
                          })
                          .addCase(fetchActiveSizeList.rejected, (state, action) => {
                            state.loading = false;
                            state.error = action.payload;
                          });
    builder
      .addCase(fetchSizes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSizes.fulfilled, (state, action) => {
        state.sizes = action.payload || []
        state.loading = false
      })
      .addCase(fetchSizes.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(addSize.fulfilled, (state, action) => {
        state.sizes.push(action.payload)
      })
      .addCase(addSize.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateSize.fulfilled, (state, action) => {
        const updatedSize = action.payload
        if (!updatedSize || !updatedSize.sizeId) return
        const index = state.sizes.findIndex(
          (size) => size.sizeId === updatedSize.sizeId,
        )
        if (index !== -1) state.sizes[index] = updatedSize
      })
      .addCase(updateSize.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteSize.fulfilled, (state, action) => {
        state.sizes = state.sizes.filter(
          (size) => size.sizeId !== action.payload,
        )
      })
      .addCase(deleteSize.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default sizeSlice.reducer
