import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth/")
      ) {
        window.location.href = "/auth/sign-in";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
