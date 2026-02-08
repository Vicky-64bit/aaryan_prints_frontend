import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

//async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// async funtion to create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Async thunk to update an existing product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.saving = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.saving = false;
        const exists = state.products.find(p => p._id === action.payload._id);
        if (!exists) state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || "Failed to create product";
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || "Failed to update product";
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.saving = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || "Failed to delete product";
      });
  },
});


export const { clearError } = adminProductSlice.actions;
export default adminProductSlice.reducer;