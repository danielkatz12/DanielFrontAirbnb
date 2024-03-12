import axios, {AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {
    getAccessTokenFromLocalStorage,
    getRefreshTokenFromLocalStorage, saveAccessTokenInLocalStorage,
    saveRefreshTokenInLocalStorage
} from "./token-service.ts";
import {useRefreshToken} from "./user-service.ts";

const headers = {
    'Content-Type': 'application/json' // example content type, adjust as needed
};

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {...headers}
});
// // Add a request interceptor to attach access token to requests
// apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
//     const token = getAccessTokenFromLocalStorage();
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// Define your header
// Add a request interceptor to attach access token to requests
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!authBypass(config)) {
        const token: string | null = getAccessTokenFromLocalStorage();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function authBypass(config: InternalAxiosRequestConfig) {
    return config.url!.startsWith('/auth/refresh') ||  config.url!.startsWith('/auth/logout');
}

export { AxiosError }

let isRefreshing = false;
let failedQueue: ((token: string) => void)[] = [];

// Add a response interceptor to handle token refreshing and retrying failed requests
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log("got authorization error ->> need to refersh token");
            if (!isRefreshing) {
                isRefreshing = true;
                //const refreshToken = getRefreshTokenFromLocalStorage();
                try {
                    // Call your server's refresh token endpoint
                    await useRefreshToken();
                    const newAccessToken = getAccessTokenFromLocalStorage();

                    // Store the new access and refresh tokens
                    // saveRefreshTokenInLocalStorage(response.data.refreshToken);
                    // saveAccessTokenInLocalStorage(newAccessToken);

                    //console.log("Finish to refresh the tokens and saved on local storage successfully.")

                    // Retry all queued requests with the new access token
                    retryFailedRequests(newAccessToken!);

                    // Retry the original request with the new access token
                    originalRequest!.headers.Authorization = `Bearer ${newAccessToken}`;//todo: maybe it is useless becoase we already have intercaptor on all request??
                    return axios(originalRequest!);
                } catch (refreshError) {
                    // Handle refresh token failure (e.g., redirect to login)
                    console.error('Error refreshing token:', refreshError);
                    throw refreshError;
                } finally {
                    isRefreshing = false;
                }
            } else {
                // If token is already refreshing, add the request to the failed queue
                return new Promise((resolve, reject) => {
                    console.log("still in refreshing tokens... saved the request to retry it later...")
                    failedQueue.push((token: string) => {
                        originalRequest!.headers.Authorization = `Bearer ${token}`;
                        resolve(axios(originalRequest!));
                    });
                });
            }
        }
        return Promise.reject(error);
    }
);


// Function to retry all queued requests with the new access token
const retryFailedRequests = (newAccessToken: string) => {
    console.log("Retry failed request...")
    failedQueue.forEach(callback => callback(getAccessTokenFromLocalStorage()!));
    failedQueue = []; // Clear the failed queue after retrying all requests
};


export default apiClient;
