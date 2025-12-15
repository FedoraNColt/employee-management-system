import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Employee,
  LoginEmployeeResponse,
  PayRollPreview,
  PayStub,
  TimeSheet,
} from "../types";
import useAuthenticationService, {
  type AuthenticationServiceType,
} from "./AuthenticationService";
import useEmployeeService, {
  type EmployeeServiceType,
} from "./EmployeeService";
import usePayService, { type PayServiceType } from "./PayService";
import useAxios from "./useAxios";
import useLocalStorage from "./useLocalStorage";

export type GlobalContextType = {
  token: string | null;
  refresh: string | null;
  employee: Employee | undefined;
  employees: Employee[];
  timeSheet: TimeSheet | undefined;
  timeSheets: TimeSheet[];
  payRollPreview: PayRollPreview[];
  payRoll: PayStub[];
  payStubs: PayStub[];
  clearState: () => void;
  authenticationService: AuthenticationServiceType;
  employeeService: EmployeeServiceType;
  payService: PayServiceType;
};

export type GlobalContextReducers = {
  clearState: () => void;
  updateAuth: (loginResponse: LoginEmployeeResponse) => void;
  updateEmployee: (employee: Employee) => void;
  updateEmployees: (employees: Employee[]) => void;
  updateTimeSheet: (timeSheet: TimeSheet | undefined) => void;
  updateTimeSheets: (timeSheets: TimeSheet[]) => void;
  updatePayRollPreview: (payRollPreview: PayRollPreview[]) => void;
  updatePayRoll: (payRoll: PayStub[]) => void;
  updatePayStubs: (payStubs: PayStub[]) => void;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

function GlobalContextProvider(props: { children: React.ReactNode }) {
  const {
    value: storedAuthToken,
    setLocalStorageItem: setStoredAuthToken,
    removeLocalStorageItem: removeStoredAuthToken,
  } = useLocalStorage("token");

  const {
    value: storedRefreshToken,
    setLocalStorageItem: setStoredRefreshToken,
    removeLocalStorageItem: removeStoredRefreshToken,
  } = useLocalStorage("refresh");

  const [token, setToken] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<string | null>(null);
  const [employee, setEmployee] = useState<Employee | undefined>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeSheet, setTimeSheet] = useState<TimeSheet | undefined>();
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]);
  const [payRollPreview, setPayRollPreview] = useState<PayRollPreview[]>([]);
  const [payRoll, setPayRoll] = useState<PayStub[]>([]);
  const [payStubs, setPayStubs] = useState<PayStub[]>([]);

  useEffect(() => {
    if (!token && !refresh) {
      setToken(storedAuthToken || "");
      setRefresh(storedRefreshToken || "");
    } else {
      setStoredAuthToken(token || "");
      setStoredRefreshToken(refresh || "");
    }
  }, [
    token,
    refresh,
    storedAuthToken,
    storedRefreshToken,
    setStoredAuthToken,
    setStoredRefreshToken,
  ]);

  const authenticatedAxios = useAxios(true, token || "");
  const unAuthenticatedAxios = useAxios(false);

  const clearState = useCallback(() => {
    removeStoredAuthToken();
    removeStoredRefreshToken();
    setToken(null);
    setRefresh(null);
    setEmployee(undefined);
    setEmployees([]);
    setTimeSheet(undefined);
    setTimeSheets([]);
    setPayRollPreview([]);
    setPayRoll([]);
    setPayStubs([]);
  }, [removeStoredAuthToken, removeStoredRefreshToken]);

  const updateAuth = useCallback((loginResponse: LoginEmployeeResponse) => {
    setEmployee(loginResponse.employee);
    setToken(loginResponse.token);
    setRefresh(loginResponse.refresh);
  }, []);

  const updateEmployee = useCallback((employee: Employee | undefined) => {
    setEmployee(employee);
  }, []);

  const updateEmployees = useCallback((employees: Employee[]) => {
    setEmployees(employees);
  }, []);

  const updateTimeSheet = useCallback((timeSheet: TimeSheet | undefined) => {
    setTimeSheet(timeSheet);
  }, []);

  const updateTimeSheets = useCallback((timeSheets: TimeSheet[]) => {
    setTimeSheets(timeSheets);
  }, []);

  const updatePayRollPreview = useCallback(
    (payRollPreview: PayRollPreview[]) => {
      setPayRollPreview(payRollPreview);
    },
    []
  );

  const updatePayRoll = useCallback((payRoll: PayStub[]) => {
    setPayRoll(payRoll);
  }, []);

  const updatePayStubs = useCallback((payStubs: PayStub[]) => {
    setPayStubs(payStubs);
  }, []);

  const reducers: GlobalContextReducers = useMemo(
    () => ({
      clearState,
      updateAuth,
      updateEmployee,
      updateEmployees,
      updateTimeSheet,
      updateTimeSheets,
      updatePayRollPreview,
      updatePayRoll,
      updatePayStubs,
    }),
    [
      clearState,
      updateAuth,
      updateEmployee,
      updateEmployees,
      updateTimeSheet,
      updateTimeSheets,
      updatePayRollPreview,
      updatePayRoll,
      updatePayStubs,
    ]
  );

  const authenticationService = useAuthenticationService(
    authenticatedAxios,
    unAuthenticatedAxios,
    reducers
  );
  const employeeService = useEmployeeService(
    employee,
    authenticatedAxios,
    reducers
  );
  const payService = usePayService(unAuthenticatedAxios, reducers);

  return (
    <GlobalContext.Provider
      value={{
        token,
        refresh,
        employee,
        employees,
        timeSheet,
        timeSheets,
        payRollPreview,
        payRoll,
        payStubs,
        clearState,
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
