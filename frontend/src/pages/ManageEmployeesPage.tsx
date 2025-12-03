import { CreateEmployeeForm } from "../components/CreateEmployeeForm/CreateEmployeeForm";
import { EmployeesCard } from "../components/EmployeesCard/EmployeesCard";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";
import "./ManageEmployeesPage.css";
import { useEffect } from "react";

export default function ManageEmployeesPage() {
  const { employees, authenticationService, employeeService } =
    useGlobalContext() as GlobalContextType;

  useEffect(() => {
    employeeService.fetchAllEmployees();
  }, []);

  return (
    <div className="page-container">
      {authenticationService.creatingEmployee && <CreateEmployeeForm />}
      <EmployeesCard
        header="Manage Employees"
        employees={employees}
        displayEditEmployee={true}
      />
    </div>
  );
}
