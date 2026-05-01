import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest , getToken } from "../pages/api/auth";
import { } from "../pages/api/auth"; // getToken import karein

const API_ENDPOINTS = {
  DASHBOARD: "/AdminAuthentication/getAdminDashboardDetails",
};

// Fetch Dashboard Data with Token
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken(); // Token retrieve karein
      if (!token) throw new Error("No token found, please login again");

      const response = await postRequest(API_ENDPOINTS.DASHBOARD, {}, token);

      if (!response) throw new Error("Invalid API response: response is null");
      if (response.statusCode === 400) return rejectWithValue(response.message);
      return Array.isArray(response.data) ? response.data[0] : {};
    } catch (error) {
      console.error(" API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          totalUsers: action.payload.totalUsers ||0,
          totalOrder: action.payload.totalOrder || 0,
          todayOrder: action.payload.todayOrder || 0,
          pendingOrder: action.payload.pendingOrder || 0,
          returnOrder: action.payload.returnOrder || 0,
          cancelOrder: action.payload.cancelOrder || 0,
          lowProduct: action.payload.lowProduct || 0,
          outOfStock: action.payload.outOfStock || 0,
          totalProduct: action.payload.totalProduct || 0,
          todayRevenue: action.payload.todayRevenue || 0,
          totalRevenue: action.payload.totalRevenue || 0,
          lastWeekUsers: action.payload.lastWeekUsers || 0,
        };
        state.transactions = action.payload.todayOrderList || [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load data";
        console.error(" Dashboard API Call Failed:", state.error);
      });
  },
});

export default dashboardSlice.reducer;

