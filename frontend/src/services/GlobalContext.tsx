import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Employee } from "../types";
import { apiClient } from "./apiClient";
import useAuthenticationService, {
  type AuthenticationServiceType,
} from "./AuthenticationService";
import useEmployeeService, {
  type EmployeeServiceType,
} from "./EmployeeService";

export type GlobalContextType = {
  employee: Employee | undefined;
  employees: Employee[];
  authenticationService: AuthenticationServiceType;
  employeeService: EmployeeServiceType;
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
  const [employee, setEmployee] = useState<Employee | undefined>();
  const [employees, setEmployees] = useState<Employee[]>([]);

  const updateEmployee = useCallback((employee: Employee | undefined) => {
    setEmployee(employee);
  }, []);

  const updateEmployees = useCallback((employees: Employee[]) => {
    setEmployees(employees);
  }, []);

  const reducers: GlobalContextReducers = useMemo(
    () => ({ updateEmployee, updateEmployees }),
    [updateEmployee, updateEmployees]
  );

  const authenticationService = useAuthenticationService(apiClient, reducers);

  const employeeService = useEmployeeService(employee, apiClient, reducers);

  return (
    <GlobalContext.Provider
      value={{ employee, employees, authenticationService, employeeService }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}

export { useGlobalContext as default, GlobalContextProvider };
