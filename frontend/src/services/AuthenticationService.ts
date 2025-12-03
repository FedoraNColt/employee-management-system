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
  submitLogin: (email: string, password: string) => void;
  updateCreatingEmployee: (payload: boolean) => void;
  submitRegister: (
    payload: RegisterEmployeePayload,
    employees: Employee[]
  ) => void;
};

export default function useAuthenticationService(
  request: Axios,
  reducers: GlobalContextReducers
): AuthenticationServiceType {
  const { updateEmployee, updateEmployees } = reducers;

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

      const res = await request.post("/auth/register", payload);
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

  return {
    loadingEmployeeInformation,
    employeeAuthenticationError,
    creatingEmployee,
    newEmployeeCredentials,
    employeeCreationError,
    savingNewEmployee,
    submitLogin,
    updateCreatingEmployee,
    submitRegister,
  };
}
