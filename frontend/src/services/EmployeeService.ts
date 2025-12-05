import type { Axios } from "axios";
import type { EditEmployeePayload, Employee, PayInformation } from "../types";
import type { GlobalContextReducers } from "./GlobalContext";
import { useCallback, useState } from "react";

export type EmployeeServiceType = {
  employeeUpdating: boolean;
  employeeUpdateError: boolean;
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
};

export default function useEmployeeService(
  loggedInEmployee: Employee | undefined,
  request: Axios,
  reducers: GlobalContextReducers
): EmployeeServiceType {
  const { updateEmployees } = reducers;

  const [employeeUpdating, setEmployeeUpdating] = useState<boolean>(false);
  const [employeeUpdateError, setEmployeeUpdateError] =
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
      setEmployeeUpdateError(false);
    } finally {
      setEmployeeUpdating(false);
    }
  };

  return {
    employeeUpdating,
    employeeUpdateError,
    fetchAllEmployees,
    submitUpdateInformation,
    submitUpdatePayInformation,
  };
}
