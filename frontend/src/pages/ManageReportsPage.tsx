import { useEffect } from "react";
import { EmployeesCard } from "../components/EmployeesCard/EmployeesCard";
import { Loading } from "../components/Loading/Loading";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";

export default function ManageReportsPage() {
  const { employee, employees, employeeService } =
    useGlobalContext() as GlobalContextType;

  useEffect(() => {
    if (employee) {
      employeeService.fetchManagersReports(employee.email);
    }
  }, [employee]);

  return (
    <div className="page-container">
      {employee ? (
        <div>
          <EmployeesCard
            header="Your Reports"
            employees={employees}
            displayEditEmployee={false}
          />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
