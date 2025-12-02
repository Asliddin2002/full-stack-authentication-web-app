import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "../../lib/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      fetchApi<LoginResponse, LoginRequest>({
        path: "/log-in",
        method: "POST",
        body: data,
      }),
  });
}
