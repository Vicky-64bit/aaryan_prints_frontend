import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all users(admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
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
});

// Add create user action
export const addUser = createAsyncThunk("admin/addUser", async(userData, {rejectWithValue})=>{
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
            userData,
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
});

// Update user info
export const updateUser = createAsyncThunk("admin/updateUser", async({id, ...userData}, { rejectWithValue })=>{
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, 
            userData,
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
});

//Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async(id, { rejectWithValue })=>{
    try {
        await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("usertoken")}`,
                },
            }
        );
        return id;
    } catch (error) {
        return rejectWithValue(
            error.response?.data || { message: error.message }
        );
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to fetch users";
        })
        .addCase(updateUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
            const updatedUser = action.payload;
            const userIndex = state.users.findIndex((user)=> user._id === updatedUser._id);
            if(userIndex !== -1){
                state.users[userIndex] = updatedUser;
            }
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to update user";
        })
        .addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = state.users.filter((user) => user._id !== action.payload);
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to delete user";
        })
        .addCase(addUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.users.push(action.payload);
        })
        .addCase(addUser.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Failed to add user";
        });
    }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;