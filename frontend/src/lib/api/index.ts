import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface FetchParams<TBody> {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body: TBody;
  params?: Record<string, string>;
}

const TokenService = {
  getAccess() {
    return localStorage.getItem("accessToken");
  },
  getRefresh() {
    return localStorage.getItem("refreshToken");
  },
  save({ accessToken, refreshToken }: Tokens) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

const api: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenService.getAccess();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failQueue = [];
}

async function refreshAccessToken() {
  try {
    const refreshToken = TokenService.getRefresh();
    if (!refreshToken) throw new Error("No refresh token");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {
        refreshToken,
      }
    );

    const { accessToken, refreshToken: newRefresh } = res.data;

    TokenService.save({ accessToken, refreshToken: newRefresh });

    return accessToken;
  } catch (error) {
    TokenService.clear();
    throw error;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   if (isRefreshing) {
    //     return new Promise((resolve, reject) => {
    //       failQueue.push({ resolve, reject });
    //     })
    //       .then((token) => {
    //         originalRequest.headers = originalRequest.headers ?? {};
    //         originalRequest.headers["Authorization"] = `Bearer ${token}`;
    //         return api(originalRequest);
    //       })
    //       .catch((err) => Promise.reject(err));
    //   }
    //   originalRequest._retry = true;
    //   isRefreshing = true;

    //   try {
    //     const newToken = await refreshAccessToken();
    //     processQueue(null, newToken);
    //     isRefreshing = false;

    //     originalRequest.headers = originalRequest.headers ?? {};
    //     originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

    //     return api(originalRequest);
    //   } catch (error) {
    //     processQueue(error, null);
    //     isRefreshing = false;
    //     return Promise.reject(error);
    //   }
    // }

    return Promise.reject(error.response?.data);
  }
);

export async function fetchApi<TResponse, TBody = unknown>({
  path,
  method = "GET",
  body,
  params,
}: FetchParams<TBody>): Promise<TResponse> {
  const res = await api.request<TResponse>({
    url: path,
    method,
    params,
    data: body instanceof FormData ? body : body ?? undefined,
  });

  return res.data;
}

export default api;
