import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: "application/json",
    },
});

// Attach Guest Token
api.interceptors.request.use(
    (config) => {
        const guestToken = localStorage.getItem("guest_token");

        if (guestToken) {
            config.headers["X-Guest-Token"] = guestToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Attach Admin/User Sanctum Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Global Response Error Handling
api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");

            console.error("401 Unauthorized - Token missing or invalid");
        }

        if (status === 403) {
            console.error("403 Forbidden - Permission denied");
        }

        if (status === 404) {
            console.error("404 Not Found");
        }

        if (status === 422) {
            console.error("422 Validation Error:", error.response?.data);
        }

        if (status >= 500) {
            console.error(
                "Server Error:",
                error.response?.data?.message
            );
        }

        return Promise.reject(error);
    }
);

export default api;