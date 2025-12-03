import { Outlet } from "react-router-dom";
import "./LayoutPage.css";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";
import { Navbar } from "../components/Navbar/Navbar";

function LayoutPage() {
  const { employee } = useGlobalContext() as GlobalContextType;
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
