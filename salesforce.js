import axios from 'axios';

const tokenUrl = import.meta.env.VITE_SF_TOKEN_URL;
const apiBaseUrl = import.meta.env.VITE_SF_API_BASE_URL;

const getNewToken = async () => {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', import.meta.env.VITE_SF_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_SF_CLIENT_SECRET);
    params.append('refresh_token', import.meta.env.VITE_SF_REFRESH_TOKEN);

    try {
        const response = await axios.post(tokenUrl, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const { access_token } = response.data;
        localStorage.setItem('salesforce_access_token', access_token);
        return access_token;
    } catch (error) {
        console.error('Failed to refresh Salesforce token:', error);
        // Handle token refresh failure (e.g., redirect to login)
        return null;
    }
};

const api = axios.create({
    baseURL: apiBaseUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('salesforce_access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await getNewToken();
            if (newAccessToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default api;