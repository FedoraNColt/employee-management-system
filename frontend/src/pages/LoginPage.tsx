import { useNavigate } from "react-router-dom";
import useGlobalContext, {
  type GlobalContextType,
} from "../services/GlobalContext";
import { useCallback, useEffect } from "react";
import { LoginForm } from "../components/LoginForm/LoginForm";

function LoginPage() {
  const { employee } = useGlobalContext() as GlobalContextType;
  const navigate = useNavigate();

  const navigateToEmployeePortal = useCallback(() => {
    navigate(`/portal/${employee?.employeeType.toLowerCase()}`);
  }, [navigate, employee]);

  useEffect(() => {
    if (employee) {
      navigateToEmployeePortal();
    }
  }, [employee, navigateToEmployeePortal]);

  return (
    <div className="page">
      <div className="page-container-center">
        <h1>Company Portal</h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
