import api from "./axios.api";

const authApi = {
    register: async (userData) => {
        const response = await api.post("/auth/register", userData);

        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);

        return response.data;
    },

    refreshToken: async (refreshToken) => {
        const response = await api.post("/auth/refresh", {
            refreshToken,
        });

        return response.data;
    },

    logout: async () => {
        const response = await api.post("/users/logout");

        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get("/auth/me");

        return response.data.data;
    },

    getUsers: async (params = {}) => {
        const response = await api.get("/auth", {
            params,
        });

        return response.data.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/auth/${id}`);

        return response.data.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(
            `/auth/${id}`,
            userData
        );

        return response.data.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/auth/${id}`);

        return response.data;
    },
};

export default authApi;