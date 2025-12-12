import { CreateEmployeeForm } from "../components/CreateEmployeeForm/CreateEmployeeForm";
import { EmployeesCard } from "../components/EmployeesCard/EmployeesCard";
import { PayRollCard } from "../components/PayRollCard/PayRollCard";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";
import "./ManageEmployeesPage.css";
import { useEffect } from "react";

export default function ManageEmployeesPage() {
  const {
    employees,
    authenticationService,
    employeeService: { fetchAllEmployees },
  } = useGlobalContext() as GlobalContextType;

  useEffect(() => {
    fetchAllEmployees();
  }, [fetchAllEmployees]);

  return (
    <div className="page-container">
      {authenticationService.creatingEmployee && <CreateEmployeeForm />}
      <EmployeesCard
        header="Manage Employees"
        employees={employees}
        displayEditEmployee={true}
      />
      <PayRollCard />
    </div>
  );
}
