
import { createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/auth.api";

// Normalize Axios/API response
const getResponseData = (response) => {
    return response?.data?.data ?? response?.data ?? response;
};

// REGISTER
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            return await authApi.register(userData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Registration failed"
            );
        }
    }
);

// LOGIN
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);

            const data = getResponseData(response);

            const accessToken = data?.accessToken;
            const refreshToken = data?.refreshToken;
            const user = data?.user;

            if (!accessToken) {
                return rejectWithValue(
                    "Access token not found in login response"
                );
            }

            // Store authentication in current browser tab
            sessionStorage.setItem(
                "accessToken",
                accessToken
            );

            if (refreshToken) {
                sessionStorage.setItem(
                    "refreshToken",
                    refreshToken
                );
            }

            if (user) {
                sessionStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }

            // Clean up previous localStorage authentication
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

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

// GET CURRENT USER
export const getCurrentUser = createAsyncThunk(
    "auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            return await authApi.getCurrentUser();
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to get current user"
            );
        }
    }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.logout();

            return response;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Logout failed"
            );

        } finally {
            // Always clear local authentication
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        }
    }
);

// GET USERS
export const getUsers = createAsyncThunk(
    "auth/getUsers",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await authApi.getUsers(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load users"
            );
        }
    }
);

// UPDATE USER
export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            return await authApi.updateUser(id, userData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update user"
            );
        }
    }
);

// DELETE USER
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
