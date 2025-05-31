import axios, { AxiosInstance } from "axios";
import { getCookie, hasCookie } from "cookies-next/client";

export const axios_ins: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

// Set headers using an interceptor
axios_ins.interceptors.request.use(
  (config) => {
    if (hasCookie("authToken")) {
      const token = getCookie("authToken");
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log(token);
    }
    if (hasCookie("device_token")) {
      const deviceToken = getCookie("device_token");
      config.headers["device-token"] = deviceToken;
      console.log(deviceToken);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Instance without interceptors (for login, public APIs)
export const axios_base: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});