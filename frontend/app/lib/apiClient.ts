import { createCookie } from "react-router";
import axios from "axios";

let authToken: string | null = null;

export const tokenCookie = createCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
})

export const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api` || "http://localhost:3000/api",
    timeout: 10_000,
    withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
    if(authToken){
        config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

export function setApiToken(token: string | null) {
    authToken = token;
}

export const createApiClientWithToken = (token?: string | null) => {
  return {
    get: (url: string, config = {}) =>
      apiClient.get(url, {
        ...config,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          ...(config as any).headers,
        },
      }),

    post: (url: string, data?: any, config = {}) =>
      apiClient.post(url, data, {
        ...config,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          ...(config as any).headers,
        },
      }),

    put: (url: string, data?: any, config = {}) =>
      apiClient.put(url, data, {
        ...config,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          ...(config as any).headers,
        },
      }),

    delete: (url: string, config = {}) =>
      apiClient.delete(url, {
        ...config,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          ...(config as any).headers,
        },
      }),
  };
};