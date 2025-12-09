import axios from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "./config";

const axiosInstance = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("auth-token");
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default axiosInstance;