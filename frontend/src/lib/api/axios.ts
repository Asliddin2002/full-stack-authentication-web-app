import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

type FetchParams<TBody> = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body: TBody;
};

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export const api = {
  async fetch<TResponse, TBody = unknown>({
    path,
    method = "GET",
    body,
  }: FetchParams<TBody>): Promise<TResponse> {
    const token = localStorage.getItem("token");
    const isFormData = body instanceof FormData;
    const headers = buildHeader(token, isFormData, path);

    const config: AxiosRequestConfig = {
      url: `${import.meta.env.VITE_API_URL}${path}`,
      method,
      headers,
      data:
        method !== "GET"
          ? isFormData
            ? body
            : JSON.stringify(body)
          : undefined,
      responseType: "json",
      withCredentials: true,
    };

    return sandRequest<TResponse>(config);
  },
};

function buildHeader(token: string | null, isFormData: boolean, path: string) {
  const headers: Record<string, string> = {
    ...(isFormData ? {} : DEFAULT_HEADERS),
  };

  if (!["sign-up", "log-in"].includes(path)) {
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function sandRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;

    if (err.response?.status === 401) {
      localStorage.clear();
    }

    throw err;
  }
}
