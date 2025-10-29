import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export const getAdminStats = createAsyncThunk('admin/getStats', async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
});

export const getAllUsers = createAsyncThunk('admin/getAllUsers', async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
});

export const updateUserStatus = createAsyncThunk('admin/updateUserStatus', async ({ userId, status }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/users/${userId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('User status updated!');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update user status';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const getAllVendors = createAsyncThunk('admin/getAllVendors', async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/admin/vendors`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
});

export const updateVendorStatus = createAsyncThunk('admin/updateVendorStatus', async ({ vendorId, status }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/vendors/${vendorId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Vendor status updated!');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update vendor status';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const getAllProducts = createAsyncThunk('admin/getAllProducts', async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
});

export const updateProductStatus = createAsyncThunk('admin/updateProductStatus', async ({ productId, status }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/products/${productId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Product status updated!');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update product status';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const getAllOrders = createAsyncThunk('admin/getAllOrders', async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    vendors: [],
    products: [],
    orders: [],
    stats: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminStats.pending, (state) => { state.isLoading = true; })
      .addCase(getAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(getAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.data.users;
      })
      .addCase(getAllVendors.fulfilled, (state, action) => {
        state.vendors = action.payload.data.vendors;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.products = action.payload.data.products;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data.orders;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.data._id);
        if (index !== -1) {
          state.users[index] = action.payload.data;
        }
      })
      .addCase(updateVendorStatus.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(v => v._id === action.payload.data._id);
        if (index !== -1) {
          state.vendors[index] = action.payload.data;
        }
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload.data._id);
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      });
  },
});

export default adminSlice.reducer;