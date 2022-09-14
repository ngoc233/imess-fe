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
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
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
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = rs.data;
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
            history.replace("/auth/login");
            return Promise.reject(_error);
          }
        } else {
          if (accessToken) {
            localStorage.removeItem("accessToken");
          }
          if (localStorage.getItem("role")) {
            localStorage.removeItem("role");
          }
          history.replace("/auth/login");
        }
      }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);
export const getAPI: (
  url: string,
  headers?: AxiosRequestHeaders | undefined,
  params?: any
) => Promise<any> = (
  url: string,
  headers?: AxiosRequestHeaders | undefined,
  params?: any
) => {
  return axiosInstance.get(url, {
    headers,
    params,
  });
};
export const postAPI = (
  url: string,
  data?: any,
  headers?: AxiosRequestHeaders | undefined,
  params?: any
) => {
  return axiosInstance.post(url, data, {
    headers,
    params,
  });
};
export const putAPI = (
  url: string,
  data?: any,
  headers?: AxiosRequestHeaders | undefined,
  params?: any
) => {
  return axiosInstance.put(url, data, {
    headers,
    params,
  });
};
export const patchAPI = (
  url: string,
  data?: any,
  headers?: AxiosRequestHeaders | undefined,
  params?: any
) => {
  return axiosInstance.patch(url, data, {
    headers,
    params,
  });
};
export const deleteAPI = (
  url: string,
  headers?: AxiosRequestHeaders | undefined,
  params?: any
) => {
  return axiosInstance.delete(url, {
    headers,
    params,
  });
};
