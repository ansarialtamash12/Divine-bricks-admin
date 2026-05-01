import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest, postCreate, postRequest, postUpdate, } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/steps-constant'

export const fetchSteps = createAsyncThunk(
  'step/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_STEPS)
      if (!response || !response.data) {
        throw new Error('Invalid steps data received')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching steps')
    }
  },
)

export const addSteps = createAsyncThunk(
  'step/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postCreate(API_ENDPOINTS.ADD_ALL_STEPS, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding steps')
    }
  },
)

export const updateSteps = createAsyncThunk(
  'step/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_ALL_STEPS, data)
      return response

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating steps')
    }
  },
)

export const deleteSteps = createAsyncThunk(
  'step/delete',
  async ({ stepsId }, { rejectWithValue }) => {
    try {
      const data = { stepsId }
      await postRequest(API_ENDPOINTS.DELETE_ALL_STEPS, data)
      return stepsId
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting steps')
    }
  },
);

export const fetchActiveStepsList = createAsyncThunk(
  'step/fetchActiveStepsList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_ACTIVE_STEPS);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
      );
    }
  }
);
const stepsSlice = createSlice({
  name: 'steps',
  initialState: {
    steps: [],
    stepsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {

    builder

      .addCase(fetchActiveStepsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveStepsList.fulfilled, (state, action) => {
        state.loading = false;
        state.stepsList = action.payload;
      })
      .addCase(fetchActiveStepsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSteps.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSteps.fulfilled, (state, action) => {
        state.steps = action.payload || []
        state.loading = false
      })
      .addCase(fetchSteps.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(addSteps.fulfilled, (state, action) => {
        state.steps.push(action.payload)
      })
      .addCase(addSteps.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateSteps.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateSteps.fulfilled, (state, action) => {
        state.steps = state.steps.filter(
          (steps) => steps.stepsId !== action.payload,
        )
      })
      .addCase(deleteSteps.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default stepsSlice.reducer
