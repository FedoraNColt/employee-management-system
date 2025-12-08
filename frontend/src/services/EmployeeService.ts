import type { Axios } from "axios";
import type {
  ContactInformation,
  EditEmployeePayload,
  Employee,
  PayInformation,
} from "../types";
import type { GlobalContextReducers } from "./GlobalContext";
import { useCallback, useState } from "react";

export type EmployeeServiceType = {
  employeeUpdating: boolean;
  employeeUpdateError: boolean;
  employeeUpdateCompleted: boolean;
  fetchAllEmployees: () => void;
  submitUpdateInformation: (
    payload: EditEmployeePayload,
    employees: Employee[]
  ) => void;
  submitUpdatePayInformation: (
    payload: PayInformation,
    email: string,
    employees: Employee[]
  ) => void;
  submitUpdateContactInformation: (
    paload: ContactInformation,
    email: string
  ) => void;
};

export default function useEmployeeService(
  loggedInEmployee: Employee | undefined,
  request: Axios,
  reducers: GlobalContextReducers
): EmployeeServiceType {
  const { updateEmployees, updateEmployee } = reducers;

  const [employeeUpdating, setEmployeeUpdating] = useState<boolean>(false);
  const [employeeUpdateError, setEmployeeUpdateError] =
    useState<boolean>(false);
  const [employeeUpdateCompleted, setEmployeeUpdateCompleted] =
    useState<boolean>(false);

  const loggedInEmployeeId = loggedInEmployee?.id ?? "";

  const fetchAllEmployees = useCallback(async () => {
    try {
      const res = await request.get("/employee/");
      let filterEmployees: Employee[] = res.data;
      filterEmployees = filterEmployees.filter(
        (emp) => emp.id != loggedInEmployeeId
      );
      updateEmployees(filterEmployees);
    } catch (e) {
      console.log(e);
    }
  }, [updateEmployees, request, loggedInEmployeeId]);

  const submitUpdateInformation = async (
    payload: EditEmployeePayload,
    employees: Employee[]
  ) => {
    try {
      setEmployeeUpdating(true);
      setEmployeeUpdateError(false);

      const res = await request.put("/employee/", payload);
      updateEmployees(insertUpdatedEmployee(employees, res.data));
    } catch (e) {
      console.log(e);
      setEmployeeUpdateError(true);
    } finally {
      setEmployeeUpdating(false);
    }
  };

  function insertUpdatedEmployee(
    employees: Employee[],
    updatedEmployee: Employee
  ) {
    return employees.map((employee) =>
      employee.id === updatedEmployee.id ? updatedEmployee : employee
    );
  }

  const submitUpdatePayInformation = async (
    payload: PayInformation,
    email: string,
    employees: Employee[]
  ) => {
    try {
      setEmployeeUpdating(true);
      setEmployeeUpdateError(false);
      const res = await request.put(`/employee/pay/${email}`, payload);
      updateEmployees(insertUpdatedEmployee(employees, res.data));
    } catch (e) {
      console.log(e);
      setEmployeeUpdateError(true);
    } finally {
      setEmployeeUpdating(false);
    }
  };

  const submitUpdateContactInformation = async (
    payload: ContactInformation,
    email: string
  ) => {
    try {
      setEmployeeUpdating(true);
      setEmployeeUpdateCompleted(false);
      setEmployeeUpdateError(false);

      const res = await request.put(`/employee/contact/${email}`, payload);
      updateEmployee(res.data);
    } catch (e) {
      console.log(e);
      setEmployeeUpdateError(true);
    } finally {
      setEmployeeUpdating(false);
      setEmployeeUpdateCompleted(true);
    }
  };

  return {
    employeeUpdating,
    employeeUpdateError,
    employeeUpdateCompleted,
    fetchAllEmployees,
    submitUpdateInformation,
    submitUpdatePayInformation,
    submitUpdateContactInformation,
  };
}
