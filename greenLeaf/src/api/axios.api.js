import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Do not refresh for login/register/refresh itself
        const isAuthRequest =
            originalRequest?.url?.includes("/users/login") ||
            originalRequest?.url?.includes("/users/register") ||
            originalRequest?.url?.includes("/users/refresh");

        if (
            error.response?.status !== 401 ||
            originalRequest?._retry ||
            isAuthRequest
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Another request is already refreshing
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;

                return api(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                throw new Error("Refresh token not found");
            }

            const response = await axios.post(
                `${API_URL}/users/refresh`,
                {
                    refreshToken,
                }
            );

            const newAccessToken =
                response.data?.data?.accessToken ||
                response.data?.accessToken;

            const newRefreshToken =
                response.data?.data?.refreshToken ||
                response.data?.refreshToken;

            if (!newAccessToken) {
                throw new Error("New access token not received");
            }

            localStorage.setItem("accessToken", newAccessToken);

            // Important because your backend uses refresh-token rotation
            if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
            }

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            window.location.href = "/login";

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;