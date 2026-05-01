import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest,postCreate,postRequest,postUpdate,} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/brand-constant'

// Fetch Brands (GET Request)
export const fetchBrand = createAsyncThunk(
  'brand/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_BRAND)
      if (!response || !response.data) {
        throw new Error('Invalid brand data received')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching brands')
    }
  },
)

// Add Brand (Post Create)
export const addBrand = createAsyncThunk(
  'brand/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postCreate(API_ENDPOINTS.ADD_BRAND, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding brand')
    }
  },
)

// Update Brand (Post Update)
export const updateBrand = createAsyncThunk(
  'brand/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_BRAND, data)
      return response
      
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating brand')
    }
  },
)

// Delete Brand (Post Delete)
export const deleteBrand = createAsyncThunk(
  'brand/delete',
  async ({ brandId }, { rejectWithValue }) => {
    try {
      const data = { brandId }
      await postRequest(API_ENDPOINTS.DELETE_BRAND, data)
      return brandId
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting brand')
    }
  },
);

export const fetchActiveBrandList = createAsyncThunk(
    'brand/fetchActivebrandList',
    async (_, { rejectWithValue }) => {
      try {
        const response = await getRequest(API_ENDPOINTS.GET_ALL_BRAND_FOR_USER);
        return response.data;
        
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
        );
      }
    }
  );

// Create Slice 
const brandSlice = createSlice({
  name: 'brand',
  initialState: {
    brand: [],
    loading: false,
    error: null,
    brandData:[],
  },
  reducers: {},
  extraReducers: (builder) => {

    builder
                  .addCase(fetchActiveBrandList.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                  })
                  .addCase(fetchActiveBrandList.fulfilled, (state, action) => {
                    state.loading = false;
                    state.brandData = action.payload;
                  })
                  .addCase(fetchActiveBrandList.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                  });
    builder
      .addCase(fetchBrand.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBrand.fulfilled, (state, action) => {
        state.brand = action.payload || []
        state.loading = false
      })
      .addCase(fetchBrand.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.brand.push(action.payload)
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        const updatedBrand = action.payload
        if (!updatedBrand || !updatedBrand.brandId) return
        const index = state.brand.findIndex(
          (brand) => brand.brandId === updatedBrand.brandId,
        )
        if (index !== -1) state.brand[index] = updatedBrand
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brand = state.brand.filter(
          (brand) => brand.brandId !== action.payload,
        )
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default brandSlice.reducer
