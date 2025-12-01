import type { Axios } from "axios";
import type { GlobalContextReducers } from "./GlobalContext";
import { useState } from "react";

export type AuthenticationServiceType = {
  loadingEmployeeInformation: boolean;
  employeeAuthenticationError: boolean;
  submitLogin: (email: string, password: string) => void;
};

export default function useAuthenticationService(
  request: Axios,
  reducers: GlobalContextReducers
): AuthenticationServiceType {
  const { updateEmployee } = reducers;

  const [loadingEmployeeInformation, setLoadingEmployeeInformation] =
    useState<boolean>(false);
  const [employeeAuthenticationError, setEmployeeAuthenticationError] =
    useState<boolean>(false);

  const submitLogin = async (email: string, password: string) => {
    try {
      setEmployeeAuthenticationError(false);
      setLoadingEmployeeInformation(true);

      const res = await request.post("/auth/login", {
        email,
        password,
      });

      updateEmployee(res.data);
    } catch (e) {
      console.log(e);
      setEmployeeAuthenticationError(true);
    } finally {
      setLoadingEmployeeInformation(false);
    }
  };

  return {
    loadingEmployeeInformation,
    employeeAuthenticationError,
    submitLogin,
  };
}
