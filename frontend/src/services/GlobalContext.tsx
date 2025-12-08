import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Employee, TimeSheet } from "../types";
import { apiClient } from "./apiClient";
import useAuthenticationService, {
  type AuthenticationServiceType,
} from "./AuthenticationService";
import useEmployeeService, {
  type EmployeeServiceType,
} from "./EmployeeService";
import usePayService, { type PayServiceType } from "./PayService";

export type GlobalContextType = {
  employee: Employee | undefined;
  employees: Employee[];
  timeSheet: TimeSheet | undefined;
  authenticationService: AuthenticationServiceType;
  employeeService: EmployeeServiceType;
  payService: PayServiceType;
};

export type GlobalContextReducers = {
  updateEmployee: (employee: Employee) => void;
  updateEmployees: (employees: Employee[]) => void;
  updateTimeSheet: (timeSheet: TimeSheet | undefined) => void;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

function GlobalContextProvider(props: { children: React.ReactNode }) {
  const [employee, setEmployee] = useState<Employee | undefined>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeSheet, setTimeSheet] = useState<TimeSheet | undefined>();

  const updateEmployee = useCallback((employee: Employee | undefined) => {
    setEmployee(employee);
  }, []);

  const updateEmployees = useCallback((employees: Employee[]) => {
    setEmployees(employees);
  }, []);

  const updateTimeSheet = useCallback((timeSheet: TimeSheet | undefined) => {
    setTimeSheet(timeSheet);
  }, []);

  const reducers: GlobalContextReducers = useMemo(
    () => ({ updateEmployee, updateEmployees, updateTimeSheet }),
    [updateEmployee, updateEmployees, updateTimeSheet]
  );

  const authenticationService = useAuthenticationService(apiClient, reducers);
  const employeeService = useEmployeeService(employee, apiClient, reducers);
  const payService = usePayService(apiClient, reducers);

  return (
    <GlobalContext.Provider
      value={{
        employee,
        employees,
        timeSheet,
        authenticationService,
        employeeService,
        payService,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}

export { useGlobalContext as default, GlobalContextProvider };
