
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

// Read session data safely
const getStoredUser = () => {
    try {
        const user = sessionStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

const storedUser = getStoredUser();
const storedToken = sessionStorage.getItem("accessToken");

const initialState = {
    user: storedUser,
    users: [],
    isAuthenticated: !!storedToken && !!storedUser,
    loading: false,
    error: null,
    success: false,
};

// Remove all authentication information
const clearSessionStorage = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Remove old authentication keys from previous implementation
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Normalize API response
const getResponseData = (payload) => {
    return payload?.data?.data ?? payload?.data ?? payload;
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

        // setUser: (state, action) => {
        //     state.user = action.payload;
        //     state.isAuthenticated = !!action.payload;

        //     if (action.payload) {
        //         sessionStorage.setItem(
        //             "user",
        //             JSON.stringify(action.payload)
        //         );
        //     } else {
        //         sessionStorage.removeItem("user");
        //     }
        // },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },

        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.users = [];
            state.loading = false;
            state.error = null;
            state.success = false;
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

                const data = getResponseData(action.payload);
                const user = data?.user;
                const accessToken = data?.accessToken;

                if (user) {
                    state.user = user;
                    state.isAuthenticated = !!accessToken;
                }
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;

                clearSessionStorage();
            })

            // CURRENT USER
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;

                const data = getResponseData(action.payload);
                const user = data?.user ?? data;

                if (user && typeof user === "object" && !Array.isArray(user)) {
                    state.user = user;
                    state.isAuthenticated = true;
                }
            })

            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // LOGOUT
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // .addCase(logoutUser.fulfilled, (state) => {
            //     state.loading = false;
            //     state.user = null;
            //     state.isAuthenticated = false;
            //     state.users = [];
            //     state.success = false;

            //     clearSessionStorage();
            // })

            // .addCase(logoutUser.rejected, (state) => {
            //     state.loading = false;
            //     state.user = null;
            //     state.isAuthenticated = false;
            //     state.users = [];
            //     state.error = null;

            //     // Clear local authentication even if API fails
            //     clearSessionStorage();
            // })

            // USERS
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;

                const data = getResponseData(action.payload);

                state.users = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.users)
                        ? data.users
                        : [];
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
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.users = [];
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.users = [];
                state.error = null;
            })
    },
});

export const {
    clearAuthError,
    clearAuthSuccess,
    setUser,
    clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
