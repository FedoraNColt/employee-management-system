import { Outlet, useLocation } from "react-router-dom";
import "./LayoutPage.css";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";
import { Navbar } from "../components/Navbar/Navbar";
import { useEffect } from "react";

function LayoutPage() {
  const { employee, payService } = useGlobalContext() as GlobalContextType;

  const location = useLocation();

  useEffect(() => {
    if (employee && location.pathname === "/portal/employee/timesheets")
      payService.fetchCurrentTimeSheet(employee);
  }, [employee, location.pathname]);
  return (
    <div className="layout-page page">
      {employee && <Navbar type={employee.employeeType.toLocaleLowerCase()} />}
      {employee && (
        <h1 style={{ marginTop: "1px" }}>
          {employee.firstName} {employee.lastName}
        </h1>
      )}
      <Outlet />
    </div>
  );
}

export default LayoutPage;
