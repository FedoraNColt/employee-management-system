import { createContext, useContext, useState } from "react";
import type { Employee } from "../types";
import type { AuthenticationServiceType } from "./AuthenticationService";
import useAxios from "./useAxios";
import useAuthenticationService from "./AuthenticationService";

export type GlobalContextType = {
  employee: Employee | undefined;
  employees: Employee[];
  authenticationService: AuthenticationServiceType;
};

export type GlobalContextReducers = {
  updateEmployee: (employee: Employee) => void;
  updateEmployees: (employees: Employee[]) => void;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

function GlobalContextProvider(props: { children: React.ReactNode }) {
  const axiosRequest = useAxios();
  const [employee, setEmployee] = useState<Employee | undefined>();
  const [employees, setEmployees] = useState<Employee[]>([]);

  const updateEmployee = (employee: Employee) => {
    setEmployee(employee);
  };

  const updateEmployees = (employees: Employee[]) => {
    setEmployees(employees);
  };

  const reducers: GlobalContextReducers = {
    updateEmployee,
    updateEmployees,
  };

  const authenticationService = useAuthenticationService(
    axiosRequest,
    reducers
  );

  return (
    <GlobalContext.Provider
      value={{ employee, employees, authenticationService }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}

export { useGlobalContext as default, GlobalContextProvider };
