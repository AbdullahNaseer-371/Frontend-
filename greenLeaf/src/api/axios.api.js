import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Refresh token management
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const isAuthRequest =
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/refresh");

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            isAuthRequest
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Queue requests while refreshing
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((newToken) => {
                originalRequest.headers =
                    originalRequest.headers || {};

                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                return api(originalRequest);
            });
        }

        isRefreshing = true;

        try {
            const refreshToken =
                localStorage.getItem("refreshToken");

            if (!refreshToken) {
                throw new Error("Refresh token not found");
            }

            const response = await axios.post(
                `${API_URL}/auth/refresh`,
                { refreshToken },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data =
                response.data?.data || response.data;

            const newAccessToken = data?.accessToken;
            const newRefreshToken = data?.refreshToken;

            if (!newAccessToken) {
                throw new Error("New access token not received");
            }

            // Use ONE consistent access token key
            localStorage.setItem(
                "accessToken",
                newAccessToken
            );

            if (newRefreshToken) {
                localStorage.setItem(
                    "refreshToken",
                    newRefreshToken
                );
            }

            processQueue(null, newAccessToken);

            originalRequest.headers =
                originalRequest.headers || {};

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {

            processQueue(refreshError, null);

            // Remove all authentication data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            // Force a fresh application load
            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }

            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default api;