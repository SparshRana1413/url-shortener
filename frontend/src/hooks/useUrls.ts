import { useQuery } from "@tanstack/react-query";
import * as urlsApi from "../api/urls";

export function useUrls(page: number) {
  return useQuery({
    queryKey: ["urls", page],
    queryFn: () => urlsApi.getUrls(page),
    staleTime: 30_000,
  });
}