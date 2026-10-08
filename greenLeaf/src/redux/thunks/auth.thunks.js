import { createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/auth.api";

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);

            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Registration failed"
            );
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);

            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    "auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getCurrentUser();

            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to get current user"
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.logout();

            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Logout failed"
            );
        }
    }
);

export const getUsers = createAsyncThunk(
    "auth/getUsers",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await authApi.getUsers(params);

            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load users"
            );
        }
    }
);

export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const response = await authApi.updateUser(
                id,
                userData
            );

            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update user"
            );
        }
    }
);

export const deleteUser = createAsyncThunk(
    "auth/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            const response = await authApi.deleteUser(id);

            return {
                id,
                response,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    }
);