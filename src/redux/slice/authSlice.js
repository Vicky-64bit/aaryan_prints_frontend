import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Generate or get guestId
const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// Async Thunk for User Login (unchanged)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("usertoken", response.data.token);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for User Registration with OTP support
// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async (userData, { rejectWithValue }) => {
//     try {
//     //   const response = await axios.post(
//     //     `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
//     //     userData
//     //   );
//     const { data } = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
//         userData
//       );
//       return { ...data.data.user, token: data.data.token }; // flatten user + token

//       // Save user & token
//       localStorage.setItem("userInfo", JSON.stringify(response.data.user));
//       localStorage.setItem("usertoken", response.data.token);

//       return response.data.user;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: "Registration failed" });
//     }
//   }
// );

// Async thunk for user registeration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk for user update (unchanged)
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (updatedData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("usertoken");

      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update-user`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Update failed" }
      );
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("usertoken");
      localStorage.setItem("guestId", state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateUser.pending, (state) => {
  state.loading = true;
})
.addCase(updateUser.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload;

  // Keep localStorage in sync
  localStorage.setItem(
    "userInfo",
    JSON.stringify(action.payload)
  );
})
.addCase(updateUser.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message;
});
  }})

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
