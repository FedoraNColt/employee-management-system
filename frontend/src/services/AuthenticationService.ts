import type { Axios } from "axios";
import type { GlobalContextReducers } from "./GlobalContext";
import { useState } from "react";
import type {
  Employee,
  NewEmployeeLogin,
  RegisterEmployeePayload,
} from "../types";

export type AuthenticationServiceType = {
  loadingEmployeeInformation: boolean;
  employeeAuthenticationError: boolean;
  creatingEmployee: boolean;
  newEmployeeCredentials: NewEmployeeLogin | undefined;
  employeeCreationError: boolean;
  savingNewEmployee: boolean;
  loggingOut: boolean;
  submitLogin: (email: string, password: string) => void;
  updateCreatingEmployee: (payload: boolean) => void;
  submitRegister: (
    payload: RegisterEmployeePayload,
    employees: Employee[]
  ) => void;
  submitLogout: (employee: Employee | undefined) => void;
  submitUpdateEmployeePassword: (
    password: string,
    refreshToken: string
  ) => void;
  refreshEmployee: (refreshToken: string) => void;
};

export default function useAuthenticationService(
  authenticatedRequest: Axios,
  unAuthenticatedRequest: Axios,
  reducers: GlobalContextReducers
): AuthenticationServiceType {
  const { updateAuth, updateEmployees, clearState } = reducers;

  const [loadingEmployeeInformation, setLoadingEmployeeInformation] =
    useState<boolean>(false);
  const [employeeAuthenticationError, setEmployeeAuthenticationError] =
    useState<boolean>(false);
  const [creatingEmployee, setCreatingEmployee] = useState<boolean>(false);
  const [newEmployeeCredentials, setNewEmployeeCredentials] = useState<
    NewEmployeeLogin | undefined
  >();
  const [employeeCreationError, setEmployeeCreationError] =
    useState<boolean>(false);
  const [savingNewEmployee, setSavingNewEmployee] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const submitLogin = async (email: string, password: string) => {
    try {
      setEmployeeAuthenticationError(false);
      setLoadingEmployeeInformation(true);
      setLoggingOut(false);

      const res = await unAuthenticatedRequest.post("/auth/login", {
        email,
        password,
      });

      updateAuth(res.data);
    } catch (e) {
      console.log(e);
      setEmployeeAuthenticationError(true);
    } finally {
      setLoadingEmployeeInformation(false);
    }
  };

  const updateCreatingEmployee = (payload: boolean) => {
    setCreatingEmployee(payload);
    if (!payload) {
      setEmployeeCreationError(false);
      setNewEmployeeCredentials(undefined);
    }
  };

  const submitRegister = async (
    payload: RegisterEmployeePayload,
    employees: Employee[]
  ) => {
    try {
      setEmployeeCreationError(false);
      setSavingNewEmployee(true);

      const res = await authenticatedRequest.post("/auth/register", payload);
      const newEmployee = res.data?.employee;
      console.log(newEmployee);

      setNewEmployeeCredentials({
        email: newEmployee.email,
        temporaryPassword: res.data.temporaryPassword,
      });

      updateEmployees([...employees, newEmployee]);
    } catch (e) {
      console.log(e);
      setEmployeeCreationError(true);
    } finally {
      setSavingNewEmployee(false);
    }
  };

  const submitLogout = async (employee: Employee | undefined) => {
    try {
      if (employee) {
        await authenticatedRequest.delete("/auth/logout");
        setLoggingOut(true);
        setLoadingEmployeeInformation(false);
        clearState();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const submitUpdateEmployeePassword = async (
    password: string,
    refreshToken: string
  ) => {
    try {
      setLoadingEmployeeInformation(true);
      setEmployeeAuthenticationError(false);

      const res = await authenticatedRequest.put("/auth/password/update", {
        password,
        refreshToken,
      });
      updateAuth(res.data);
    } catch (e) {
      console.log(e);
      setEmployeeAuthenticationError(true);
    } finally {
      setLoadingEmployeeInformation(false);
    }
  };

  const refreshEmployee = async (refresh: string | null) => {
    if (refresh) {
      try {
        setLoadingEmployeeInformation(true);
        setEmployeeAuthenticationError(false);

        const res = await unAuthenticatedRequest.get(
          `/auth/refresh/${refresh}`
        );
        updateAuth(res.data);
      } catch (e) {
        console.log(e);
        setEmployeeAuthenticationError(true);
      } finally {
        setLoadingEmployeeInformation(false);
      }
    } else {
      setEmployeeAuthenticationError(true);
    }
  };

  return {
    loadingEmployeeInformation,
    employeeAuthenticationError,
    creatingEmployee,
    newEmployeeCredentials,
    employeeCreationError,
    savingNewEmployee,
    loggingOut,
    submitLogin,
    updateCreatingEmployee,
    submitRegister,
    submitLogout,
    submitUpdateEmployeePassword,
    refreshEmployee,
  };
}
