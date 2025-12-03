import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "../../lib/api";

export type SignUpRequest = {
  email: string;
  password: string;
};

export type SignUpResponse = {
  token: string;
};

export function useSignUp() {
  return useMutation({
    mutationFn: (data: SignUpRequest) =>
      fetchApi<SignUpResponse, SignUpRequest>({
        path: "/sign-up",
        method: "POST",
        body: data,
      }),
  });
}
