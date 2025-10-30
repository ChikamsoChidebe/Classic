import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

export const getCart = createAsyncThunk('cart/getCart', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (itemData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/cart/add`, itemData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Item added to cart');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add item';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/cart/update/${itemId}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/cart/remove/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('Item removed from cart');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.fulfilled, (state, action) => {
        state.items = action.payload.data.items;
        state.totalItems = action.payload.data.totalItems;
        state.totalAmount = action.payload.data.totalAmount;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.data.items;
        state.totalItems = action.payload.data.totalItems;
        state.totalAmount = action.payload.data.totalAmount;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.data.items;
        state.totalItems = action.payload.data.totalItems;
        state.totalAmount = action.payload.data.totalAmount;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.data.items;
        state.totalItems = action.payload.data.totalItems;
        state.totalAmount = action.payload.data.totalAmount;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;