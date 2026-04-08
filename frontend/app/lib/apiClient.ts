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