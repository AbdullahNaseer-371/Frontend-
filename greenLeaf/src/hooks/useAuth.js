import { useDispatch, useSelector } from "react-redux";

import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    getUsers,
    updateUser,
    deleteUser,
} from "../redux/thunks/auth.thunks";

import {
    clearAuthError,
    clearAuthSuccess,
    setUser,
    clearAuth,
} from "../redux/slice/authSlice";

const useAuth = () => {
    const dispatch = useDispatch();

    const {
        user,
        users,
        isAuthenticated,
        loading,
        error,
        success,
    } = useSelector((state) => state.auth);

    const register = (userData) => {
        return dispatch(registerUser(userData));
    };

    const login = (credentials) => {
        return dispatch(loginUser(credentials));
    };

    const getMe = () => {
        return dispatch(getCurrentUser());
    };

    const logout = () => {
        return dispatch(logoutUser());
    };

    const fetchUsers = (params = {}) => {
        return dispatch(getUsers(params));
    };

    const editUser = (id, userData) => {
        return dispatch(
            updateUser({
                id,
                userData,
            })
        );
    };

    const removeUser = (id) => {
        return dispatch(deleteUser(id));
    };

    const setCurrentUser = (userData) => {
        dispatch(setUser(userData));
    };

    const clearError = () => {
        dispatch(clearAuthError());
    };

    const clearSuccess = () => {
        dispatch(clearAuthSuccess());
    };

    const clearAuthentication = () => {
        dispatch(clearAuth());
    };

    return {
        user,
        users,

        isAuthenticated,

        loading,
        error,
        success,

        register,
        login,
        getMe,
        logout,

        fetchUsers,
        editUser,
        removeUser,

        setCurrentUser,
        clearError,
        clearSuccess,
        clearAuthentication,
    };
};

export default useAuth;