import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import env from "../../config/env";
import history from "../../utils/history";
import { refreshToken } from "./auth";

export const axiosInstance = axios.create({
  baseURL: env.baseURl,
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    //@ts-ignore
    const token = localStorage.getItem("accessToken");
    if (token) {
      //@ts-ignore
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        const accessToken = localStorage.getItem("accessToken");
        const _refreshToken = localStorage.getItem("refreshToken");
        if (_refreshToken) {
          try {
            const rs = await refreshToken(accessToken, _refreshToken);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = rs.data;
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            originalConfig.headers["Authorization"] = `Bearer ${accessToken}`;
            return axiosInstance(originalConfig);
          } catch (_error) {
            localStorage.removeItem("refreshToken");
            if (accessToken) {
              localStorage.removeItem("accessToken");
            }
            if (localStorage.getItem("role")) {
              localStorage.removeItem("role");
            }
            history.replace("/login");
            return Promise.reject(_error);
          }
        } else {
          if (accessToken) {
            localStorage.removeItem("accessToken");
          }
          if (localStorage.getItem("role")) {
            localStorage.removeItem("role");
          }
          history.replace("/login");
        }
      }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  },
);
export const getAPI: (url: string, config?: AxiosRequestConfig) => Promise<any> = (
  url: string,
  config?: AxiosRequestConfig,
) => {
  return axiosInstance.get(url, config);
};
export const postAPI = (url: string, data?: any, config?: AxiosRequestConfig) => {
  return axiosInstance.post(url, data, config);
};
export const putAPI = (url: string, data?: any, config?: AxiosRequestConfig) => {
  return axiosInstance.put(url, data, config);
};
export const patchAPI = (url: string, data?: any, config?: AxiosRequestConfig) => {
  return axiosInstance.patch(url, data, config);
};
export const deleteAPI = (url: string, config?: AxiosRequestConfig) => {
  return axiosInstance.delete(url, config);
};
