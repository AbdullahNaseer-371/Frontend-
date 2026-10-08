import api from "./axios.api";

const authApi = {
    register: async (userData) => {
        const response = await api.post("/users/register", userData);

        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post("/users/login", credentials);

        return response.data;
    },

    refreshToken: async (refreshToken) => {
        const response = await api.post("/users/refresh", {
            refreshToken,
        });

        return response.data;
    },

    logout: async () => {
        const response = await api.post("/users/logout");

        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get("/users/me");

        return response.data;
    },

    getUsers: async (params = {}) => {
        const response = await api.get("/users", {
            params,
        });

        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);

        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(
            `/users/${id}`,
            userData
        );

        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);

        return response.data;
    },
};

export default authApi;