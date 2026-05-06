import axios from 'axios';

const BASE_URL = 'https://macro-iot.onrender.com/api/v1/';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// 1. Request Interceptor: Attach the access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Catch 401s and automatically refresh the token
api.interceptors.response.use(
    (response) => response, // If it works, just pass it through
    async (error) => {
        const originalRequest = error.config;

        // If the server says 401 (Unauthorized) and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                // If there's no refresh token, boot them to the login screen
                if (!refreshToken) {
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Ask Django for a new access token
                const response = await axios.post(`${BASE_URL}auth/refresh/`, {
                    refresh: refreshToken
                });

                // Save the new shiny access token
                const newAccessToken = response.data.access;
                localStorage.setItem('access_token', newAccessToken);

                // Update the failed request with the new token and try it again!
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                // If the refresh token itself is dead/expired, nuke everything and force login
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;