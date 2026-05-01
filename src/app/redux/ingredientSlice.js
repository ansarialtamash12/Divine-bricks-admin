import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAdminUserId, getRequest, postRequest, postUpdate } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/ingredient-constant'

export const fetchIngredient = createAsyncThunk(
  'ingredient/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_INGREDIENT);

      if (!response || !response.data) {
        throw new Error('Invalid ingredient data received');
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching Ingredient');
    }
  },
)

export const addIngredient = createAsyncThunk(
  'ingredient/add',
  async (ingredientData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_INGREDIENT, ingredientData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add ingredient'
      );
    }
  }
);

export const updateIngredient = createAsyncThunk(
  'ingredient/update',
  async (ingredientData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(
        API_ENDPOINTS.UPDATE_INGREDIENT,
        ingredientData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update ingredient'
      );
    }
  }
);

export const deleteIngredient = createAsyncThunk(
  'ingredient/delete',
  async (ingredientId, { rejectWithValue }) => {
    try {
      const payload = {
        ingredientId,
        updatedBy: getAdminUserId(),
      };
      const response = await postRequest(
        API_ENDPOINTS.DELETE_INGREDIENT,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete ingredient '
      );
    }
  }
);

export const fetchActiveIngredientList = createAsyncThunk(
  'ingredient/fetchActiveIngredientList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_INGREDIENT_ACTIVE);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
      );
    }
  }
);


const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState: {
    IngredientData: [],
    IngredientList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchActiveIngredientList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveIngredientList.fulfilled, (state, action) => {
        state.loading = false;
        state.IngredientList = action.payload;
      })
      .addCase(fetchActiveIngredientList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchIngredient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIngredient.fulfilled, (state, action) => {
        state.IngredientData = action.payload
        state.loading = false
      })
      .addCase(fetchIngredient.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
    builder
      .addCase(addIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Ingredient added successfully!';
      })
      .addCase(addIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
    builder
      .addCase(updateIngredient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Ingredient updated successfully!';
      })
      .addCase(updateIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(deleteIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
})

export default ingredientSlice.reducer