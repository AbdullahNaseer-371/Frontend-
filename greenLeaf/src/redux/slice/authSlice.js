import { createSlice } from "@reduxjs/toolkit";

import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    getUsers,
    updateUser,
    deleteUser,
} from "../thunks/auth.thunks";

const storedUser = localStorage.getItem("user");

const initialState = {
    user: storedUser
        ? JSON.parse(storedUser)
        : null,

    users: [],

    isAuthenticated:
        !!localStorage.getItem("accessToken"),

    loading: false,

    error: null,

    success: false,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },

        clearAuthSuccess: (state) => {
            state.success = false;
        },

        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;

            if (action.payload) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload)
                );
            }
        },

        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.users = [];

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        },
    },

    extraReducers: (builder) => {
        builder

            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.isAuthenticated = true;

                const data =
                    action.payload?.data ||
                    action.payload;

                const user = data?.user;

                const accessToken =
                    data?.accessToken;

                const refreshToken =
                    data?.refreshToken;

                if (accessToken) {
                    localStorage.setItem(
                        "accessToken",
                        accessToken
                    );
                }

                if (refreshToken) {
                    localStorage.setItem(
                        "refreshToken",
                        refreshToken
                    );
                }

                if (user) {
                    state.user = user;

                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                }
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // CURRENT USER
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;

                const data =
                    action.payload?.data ||
                    action.payload;

                const user =
                    data?.user ||
                    data;

                state.user = user;
                state.isAuthenticated = true;

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            })

            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // LOGOUT
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;

                state.user = null;
                state.isAuthenticated = false;

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
            })

            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;

                // Even if backend logout fails,
                // remove local authentication.
                state.user = null;
                state.isAuthenticated = false;

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
            })

            // USERS
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;

                const data =
                    action.payload?.data ||
                    action.payload;

                state.users =
                    data?.users ||
                    data ||
                    [];
            })

            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE USER
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })

            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE USER
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;

                state.users = state.users.filter(
                    (user) => user._id !== action.payload.id
                );

                state.success = true;
            })

            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearAuthError,
    clearAuthSuccess,
    setUser,
    clearAuth,
} = authSlice.actions;

export default authSlice.reducer;