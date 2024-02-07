import axios, {AxiosRequestConfig, CanceledError} from "axios";
import {getAccessTokenFromLocalStorage} from "./token-service.ts";

export {CanceledError}
const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
});

// Define your header
const headers = {
    'Content-Type': 'application/json' // example content type, adjust as needed
};

// Axios request configuration
export const axiosConfig: AxiosRequestConfig = {
    headers: headers
};

apiClient.interceptors.request.use((config) => {
    const token: string | null = getAccessTokenFromLocalStorage();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default apiClient;
