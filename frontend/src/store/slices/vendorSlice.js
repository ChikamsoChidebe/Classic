import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export const getVendorProducts = createAsyncThunk('vendor/getProducts', async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/vendors/products`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
});

export const createProduct = createAsyncThunk('vendor/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/vendors/products`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Product created successfully!');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create product';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const updateProduct = createAsyncThunk('vendor/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/vendors/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Product updated successfully!');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update product';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const deleteProduct = createAsyncThunk('vendor/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/vendors/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Product deleted successfully!');
    return id;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete product';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const getVendorOrders = createAsyncThunk('vendor/getOrders', async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/vendors/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
});

export const updateOrderStatus = createAsyncThunk('vendor/updateOrderStatus', async ({ orderId, status }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/vendors/orders/${orderId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Order status updated!');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update order status';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const getVendorStats = createAsyncThunk('vendor/getStats', async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/vendors/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
});

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    products: [],
    orders: [],
    stats: {},
    currentProduct: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVendorProducts.pending, (state) => { state.isLoading = true; })
      .addCase(getVendorProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data.products;
      })
      .addCase(getVendorProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => { state.isLoading = true; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload.data);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload.data._id);
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(getVendorOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data.orders;
      })
      .addCase(getVendorStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  },
});

export const { clearCurrentProduct } = vendorSlice.actions;
export default vendorSlice.reducer;