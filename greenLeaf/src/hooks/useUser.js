
import { useCallback, useEffect, useState } from "react";

import useAuth from "./useAuth";
import userApi from "../api/auth.api";

const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong."
    );
};

const normalizeUser = (response) => {
    if (response?.user) return response.user;
    if (response?.data?.user) return response.data.user;
    if (response?.data && !Array.isArray(response.data)) {
        return response.data;
    }
    return response;
};

const normalizeUsers = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.users)) return response.users;
    if (Array.isArray(response?.data?.users)) return response.data.users;
    if (Array.isArray(response?.data)) return response.data;

    return [];
};

const useUser = () => {
    const { isAuthenticated } = useAuth();

    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const isAdmin = currentUser?.role === "Admin";
    const isManager = currentUser?.role === "Manager";
    const isEmployee = currentUser?.role === "Employee";

    // Load all users. Only Admin can use this function.
    const fetchUsers = useCallback(async () => {
        if (!isAdmin) {
            throw new Error("Only Admin can view all users.");
        }

        const response = await userApi.getUsers();

        const userList = normalizeUsers(response);

        setUsers(userList);

        return userList;
    }, [isAdmin]);

    // Load logged-in user's own profile.
    const fetchCurrentUser = useCallback(async () => {
        const response = await userApi.getCurrentUser();

        const profile = normalizeUser(response);

        setCurrentUser(profile);

        return profile;
    }, []);

    // Initial loading.
    const loadUsers = useCallback(async () => {
        if (!isAuthenticated) {
            setCurrentUser(null);
            setUsers([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await userApi.getCurrentUser();
            const profile = normalizeUser(response);

            setCurrentUser(profile);

            if (profile?.role === "Admin") {
                const usersResponse = await userApi.getUsers();

                setUsers(normalizeUsers(usersResponse));
            } else {
                // Manager and Employee only get their own profile.
                setUsers([]);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Admin: create user.
    const createUser = async (userData) => {
        if (!isAdmin) {
            throw new Error("Only Admin can create users.");
        }

        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await userApi.createUser(userData);

            await fetchUsers();

            setSuccess("User created successfully.");

            return normalizeUser(response);
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    // Admin: update user.
    const updateUser = async (id, userData) => {
        if (!isAdmin) {
            throw new Error("Only Admin can update users.");
        }

        // Admin cannot change their own role.
        if (
            String(id) === String(currentUser?._id) &&
            userData.role &&
            userData.role !== currentUser.role
        ) {
            throw new Error("You cannot change your own Admin role.");
        }

        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await userApi.updateUser(id, userData);

            await fetchUsers();

            setSuccess("User updated successfully.");

            return normalizeUser(response);
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    // Admin: delete user.
    const deleteUser = async (id) => {
        if (!isAdmin) {
            throw new Error("Only Admin can delete users.");
        }

        if (String(id) === String(currentUser?._id)) {
            throw new Error("You cannot delete your own account.");
        }

        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await userApi.deleteUser(id);

            await fetchUsers();

            setSuccess("User deleted successfully.");
        } catch (err) {
            setError(getErrorMessage(err));
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const clearError = () => setError(null);

    const clearSuccess = () => setSuccess(null);

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        currentUser,
        users,

        isAdmin,
        isManager,
        isEmployee,

        loading,
        actionLoading,

        error,
        success,

        fetchUsers,
        fetchCurrentUser,
        refreshUsers: loadUsers,

        createUser,
        updateUser,
        deleteUser,

        clearError,
        clearSuccess,
        clearMessages,
    };
};

export default useUser;
