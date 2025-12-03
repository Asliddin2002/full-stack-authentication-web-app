import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "../../lib/api";

export type UpdateRequest = {
  id: string;
  age: number;
  fullName: string;
  educationDegree: string;
};

export type UpdateResponse = {
  token: string;
};

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: UpdateRequest) =>
      fetchApi<UpdateResponse, UpdateRequest>({
        path: `/profile/${data.id}`,
        method: "PUT",
        body: data,
      }),
  });
}
