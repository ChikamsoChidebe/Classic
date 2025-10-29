import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Order placed successfully!');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Order failed';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const getOrders = createAsyncThunk('orders/getOrders', async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/orders/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.data;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data.orders;
      });
  },
});

export default orderSlice.reducer;