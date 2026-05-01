import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAdminUserId, getRequest, postRequest, postUpdate } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/concern-constant'

export const fetchConcern = createAsyncThunk(
  'concern/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_CONCERN);

      if (!response || !response.data) {
        throw new Error('Invalid Concern data received');
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching Concern');
    }
  },
)

export const addConcern = createAsyncThunk(
  'concern/add',
  async (concernData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_CONCERN, concernData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add Concern'
      );
    }
  }
);

export const updateConcern = createAsyncThunk(
  'concern/update',
  async (concernData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(
        API_ENDPOINTS.UPDATE_CONCERN,
        concernData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update Concern'
      );
    }
  }
);

export const deleteConcern = createAsyncThunk(
  'concern/delete',
  async (concernId, { rejectWithValue }) => {
    try {
      const payload = {
        concernId,
        updatedBy: getAdminUserId(),

      };
      const response = await postRequest(
        API_ENDPOINTS.DELETE_CONCERN,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete Concern '
      );
    }
  }
);

export const fetchActiveConcernList = createAsyncThunk(
  'concern/fetchActiveConcernList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_ACTIVE_CONCERN);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
      );
    }
  }
);

const concernSlice = createSlice({
  name: 'concern',
  initialState: {
    ConcernData: [],
    concernList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveConcernList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveConcernList.fulfilled, (state, action) => {
        state.loading = false;
        state.concernList = action.payload;
      })
      .addCase(fetchActiveConcernList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchConcern.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConcern.fulfilled, (state, action) => {
        state.ConcernData = action.payload
        state.loading = false
      })
      .addCase(fetchConcern.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
    builder
      .addCase(addConcern.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addConcern.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Concern added successfully!';
      })
      .addCase(addConcern.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
    builder
      .addCase(updateConcern.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateConcern.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Concern updated successfully!';
      })
      .addCase(updateConcern.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteConcern.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteConcern.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
      })
      .addCase(deleteConcern.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
})

export default concernSlice.reducer