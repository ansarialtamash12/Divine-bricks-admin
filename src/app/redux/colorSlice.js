
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest, postCreate, postRequest } from "@/app/pages/api/auth";
import { API_ENDPOINTS } from "@/app/constants/color-constant"; 

// Fetch Colors (GET Request)
export const fetchColors = createAsyncThunk("color/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await getRequest(API_ENDPOINTS.GET_ALL_COLOR);
    if (!response || !response.data) {
      throw new Error("Invalid color data received");
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching colors");
  }
});

export const addColor = createAsyncThunk("color/add", async (data, { rejectWithValue }) => {
  try {
    const response = await postCreate(API_ENDPOINTS.ADD_COLOR, data);
    return response;
  } catch (error) {
    console.error("Error adding color:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || "Error adding color");
  }
});

export const updateColor = createAsyncThunk("color/update", async (data, { rejectWithValue }) => {
  try {
    
    const response = await postRequest(API_ENDPOINTS.UPDATE_COLOR, data);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error updating color");
  }
});

export const deleteColor = createAsyncThunk("color/delete", async ({ colorId }, { rejectWithValue }) => {
  try {
    const data = { colorId };
   const response =  await postRequest(API_ENDPOINTS.DELETE_COLOR, data);
    return  {...response,colorId};
    
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error deleting color");
  }
});

export const fetchActiveColorList = createAsyncThunk(
    'brand/fetchActiveColorList',
    async (_, { rejectWithValue }) => {
      try {
        const response = await getRequest(API_ENDPOINTS.GET_ALL_COLOR_FOR_USER);
        return response.data;
        
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
        );
      }
    }
  );

const colorSlice = createSlice({
  name: "color",
  initialState: {
    color: [],
    loading: false,
    error: null,
    colorData:[],
  },
  reducers: {},
  extraReducers: (builder) => {

    builder
                      .addCase(fetchActiveColorList.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                      })
                      .addCase(fetchActiveColorList.fulfilled, (state, action) => {
                        state.loading = false;
                        state.colorData = action.payload;
                      })
                      .addCase(fetchActiveColorList.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                      });
    builder
      .addCase(fetchColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.color = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addColor.fulfilled, (state, action) => {
        state.color.push(action.payload);
      })
      .addCase(addColor.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateColor.fulfilled, (state, action) => {
        const updatedColor = action.payload;
        if (!updatedColor || !updatedColor.colorId) return;
        const index = state.color.findIndex(color => color.colorId === updatedColor.colorId);
        if (index !== -1) state.color[index] = updatedColor;
      })
      .addCase(updateColor.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteColor.fulfilled, (state, action) => {
        state.color = state.color.filter(color => color.colorId !== action.payload);
      })
      .addCase(deleteColor.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default colorSlice.reducer;
