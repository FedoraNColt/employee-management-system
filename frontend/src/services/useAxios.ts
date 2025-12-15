import axios from "axios";
import { useMemo } from "react";

export default function useAxios(authenticated: boolean, token?: string) {
  const baseURL = "http://localhost:8000";

  const request = useMemo(
    () =>
      axios.create({
        baseURL,
        headers: authenticated
          ? {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            }
          : {},
      }),
    [token, authenticated]
  );

  return request;
}
