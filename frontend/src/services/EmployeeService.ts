import type { Axios } from "axios";
import type { Employee } from "../types";
import type { GlobalContextReducers } from "./GlobalContext";

export type EmployeeServiceType = {
  fetchAllEmployees: () => void;
};

export default function useEmployeeService(
  loggedInEmployee: Employee | undefined,
  request: Axios,
  reducers: GlobalContextReducers
): EmployeeServiceType {
  const { updateEmployees } = reducers;

  const fetchAllEmployees = async () => {
    try {
      const res = await request.get("/employee/");
      let filterEmployees: Employee[] = res.data;
      filterEmployees = filterEmployees.filter(
        (emp) => emp.id != loggedInEmployee?.id
      );
      updateEmployees(filterEmployees);
    } catch (e) {
      console.log(e);
    }
  };

  return { fetchAllEmployees };
}
